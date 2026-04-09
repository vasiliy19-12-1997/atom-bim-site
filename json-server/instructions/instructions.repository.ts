import { request as httpRequest } from 'http';
import { request as httpsRequest } from 'https';
import {
    InstructionArticle,
    InstructionExternalLink,
    InstructionNavNode,
    WikiFileDto,
    WikiPageDto,
} from './types';
import {
    buildInstructionsTree,
    fetchInstructionsIndex,
    fetchInstructionsIndexSlug,
    parseInstructionsIndex,
} from './instructions.index';
import { YandexWikiClient } from './wiki.client';
import { WikiApiError } from './wiki.errors';
import {
    getNormalizedContent,
    getResolvedSlug,
    mapWikiPageToInstructionArticle,
} from './wiki.mapper';

const getRootSlug = (): string => String(process.env.YANDEX_WIKI_ROOT_SLUG || '').trim();
const TREE_CACHE_TTL_MS = 30_000;
const LINKS_CACHE_TTL_MS = 5 * 60_000;
const NOCODB_TIMEOUT = 20_000;

const DEFAULT_NOCODB_HOST = 'http://tim.atomsk.ru:3000';
const DEFAULT_NOCODB_TABLE_ID = 'm2jcg5rzheaqlxw';
const DEFAULT_NOCODB_VIEW_ID = '';

const NOCODB_HOST = (process.env.NOCODB_HOST || process.env.NOCO_DB_BASE_URL || DEFAULT_NOCODB_HOST).replace(/\/$/, '');
const NOCODB_TABLE_ID = process.env.NOCODB_INSTRUCTIONS_TABLE_ID
    || process.env.NOCODB_TABLE_ID
    || process.env.NOCO_DB_TABLE_ID
    || DEFAULT_NOCODB_TABLE_ID;
const NOCODB_VIEW_ID = process.env.NOCODB_INSTRUCTIONS_VIEW_ID
    || process.env.NOCODB_VIEW_ID
    || process.env.NOCO_DB_VIEW_ID
    || DEFAULT_NOCODB_VIEW_ID;
const NOCODB_API_TOKEN = process.env.NOCODB_API_TOKEN || process.env.NOCO_DB_API_TOKEN || process.env.XC_TOKEN || '';

const logInstructionsStage = (context: string, payload: unknown) => {
    // eslint-disable-next-line no-console
    console.info(`[instructions] ${context}`, payload);
};

const logInstructionsWarning = (context: string, payload: unknown) => {
    // eslint-disable-next-line no-console
    console.warn(`[instructions] ${context}`, payload);
};

const isAccessDeniedError = (error: unknown): error is WikiApiError => error instanceof WikiApiError && error.status === 403;
const isMissingError = (error: unknown): error is WikiApiError => error instanceof WikiApiError && error.status === 404;

type NocoListResponse = {
    list?: Array<Record<string, unknown>>;
    pageInfo?: {
        isLastPage?: boolean;
    };
};

const asString = (value: unknown): string => {
    if (typeof value === 'string') {
        return value.trim();
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
        return String(value).trim();
    }

    if (Array.isArray(value)) {
        return value
            .map((item) => asString(item))
            .filter(Boolean)
            .join(' ')
            .trim();
    }

    if (value && typeof value === 'object') {
        const record = value as Record<string, unknown>;
        return [record.title, record.name, record.label, record.value, record.url, ...Object.values(record)]
            .map((item) => asString(item))
            .find(Boolean) || '';
    }

    return '';
};

const normalizeKey = (key: string): string =>
    key
        .toLowerCase()
        .replace(/\s+/g, '')
        .replace(/[()_./\\-]/g, '');

const hasWikiUrl = (value: string): boolean => /^https?:\/\/wiki\.yandex\.ru\//i.test(value);

const pickByKeys = (row: Record<string, unknown>, keys: string[]): string => {
    const normalizedCandidates = keys.map((key) => normalizeKey(key));
    const directMatch = Object.entries(row).find(([key, value]) => {
        const normalized = normalizeKey(key);
        return normalizedCandidates.includes(normalized) && Boolean(asString(value));
    });

    if (directMatch) {
        return asString(directMatch[1]);
    }

    const partialMatch = Object.entries(row).find(([key, value]) => {
        const normalized = normalizeKey(key);
        return normalizedCandidates.some((candidate) => normalized.includes(candidate)) && Boolean(asString(value));
    });

    return partialMatch ? asString(partialMatch[1]) : '';
};

const pickWikiUrl = (row: Record<string, unknown>): string => {
    const fromWikiLink = pickByKeys(row, ['wikiLink', 'WikiLink', 'wikilink']);

    if (fromWikiLink && hasWikiUrl(fromWikiLink)) {
        return fromWikiLink;
    }

    const preferred = pickByKeys(row, [
        'wikiLink',
        'WikiLink',
        'wikilink',
        'url',
        'URL',
        'Ссылка',
        'Ссылка на инструкцию',
        'Путь к публикации',
        'Путь к публикации wiki',
        'wiki',
    ]);

    if (preferred && hasWikiUrl(preferred)) {
        return preferred;
    }

    const detected = Object.values(row)
        .map((value) => asString(value))
        .find((value) => hasWikiUrl(value));

    return detected || '';
};

const pickTitle = (row: Record<string, unknown>): string =>
    pickByKeys(row, ['Инструкция', 'instruction', 'title', 'Название', 'name']) || 'Инструкция';

const mapWikiUrlToSlug = (url: string): string => {
    const match = url.match(/^https?:\/\/wiki\.yandex\.ru\/(.+?)\/?$/i);

    if (!match) {
        return '';
    }

    try {
        return decodeURIComponent(match[1]).replace(/^\/+|\/+$/g, '');
    } catch {
        return match[1].replace(/^\/+|\/+$/g, '');
    }
};

const fetchRaw = async (url: string): Promise<string> =>
    new Promise((resolve, reject) => {
        const requester = url.startsWith('https://') ? httpsRequest : httpRequest;
        const req = requester(
            url,
            {
                method: 'GET',
                timeout: NOCODB_TIMEOUT,
                headers: NOCODB_API_TOKEN
                    ? { 'xc-token': NOCODB_API_TOKEN }
                    : undefined,
            },
            (res) => {
                const chunks: Buffer[] = [];

                res.on('data', (chunk) => {
                    chunks.push(Buffer.from(chunk));
                });

                res.on('end', () => {
                    const raw = Buffer.concat(chunks).toString('utf8');

                    if (res.statusCode && res.statusCode >= 400) {
                        reject(new Error(`NocoDB API error ${res.statusCode}: ${raw.slice(0, 180)}`));
                        return;
                    }

                    resolve(raw);
                });
            },
        );

        req.on('timeout', () => req.destroy(new Error('NocoDB API timeout')));
        req.on('error', reject);
        req.end();
    });

const fetchJson = async <T>(url: string): Promise<T> => {
    const raw = await fetchRaw(url);
    return JSON.parse(raw) as T;
};

const buildNocoRecordsUrl = (offset: number, limit: number): string => {
    const params = new URLSearchParams({
        offset: String(offset),
        limit: String(limit),
        fields: 'Id,id,ID,_id,Инструкция,instruction,title,Название,name,wikiLink,WikiLink,wikilink',
    });

    if (NOCODB_VIEW_ID) {
        params.set('viewId', NOCODB_VIEW_ID);
    }

    return `${NOCODB_HOST}/api/v2/tables/${NOCODB_TABLE_ID}/records?${params.toString()}`;
};

export class InstructionsRepository {
    private readonly client: YandexWikiClient;

    private readonly pageCache = new Map<string, Promise<WikiPageDto | null>>();

    private readonly articleCache = new Map<string, Promise<WikiPageDto | null>>();

    private treeCache: { expiresAt: number; value: Promise<InstructionNavNode[]> } | null = null;

    private linksCache: { expiresAt: number; value: Promise<InstructionExternalLink[]> } | null = null;

    private linksSnapshot: InstructionExternalLink[] = [];

    constructor(client: YandexWikiClient) {
        this.client = client;
    }

    private async getRootPage(): Promise<WikiPageDto | null> {
        const rootSlug = getRootSlug();

        if (!rootSlug) {
            throw new WikiApiError('Yandex Wiki root slug is not configured', 500);
        }

        return this.getCachedArticlePage(rootSlug);
    }

    private getCachedPage(slug: string): Promise<WikiPageDto | null> {
        const normalizedSlug = slug.trim();

        if (!this.pageCache.has(normalizedSlug)) {
            this.pageCache.set(normalizedSlug, this.client.getPageBySlug(normalizedSlug));
        }

        return this.pageCache.get(normalizedSlug) as Promise<WikiPageDto | null>;
    }

    private getCachedArticlePage(slug: string): Promise<WikiPageDto | null> {
        const normalizedSlug = slug.trim();

        if (!this.articleCache.has(normalizedSlug)) {
            this.articleCache.set(normalizedSlug, this.client.getArticlePageBySlug(normalizedSlug));
        }

        return this.articleCache.get(normalizedSlug) as Promise<WikiPageDto | null>;
    }

    private async resolveAccessiblePage(slug: string): Promise<WikiPageDto | null> {
        try {
            return await this.getCachedPage(slug);
        } catch (error) {
            if (isAccessDeniedError(error) || isMissingError(error)) {
                logInstructionsWarning('skipped inaccessible wiki node', {
                    slug,
                    status: error.status,
                    message: error.message,
                });
                return null;
            }

            throw error;
        }
    }

    private async buildTreeFromIndex(rootPage: WikiPageDto): Promise<InstructionNavNode[]> {
        const indexPage = await fetchInstructionsIndex((slug) => this.getCachedArticlePage(slug));

        if (!indexPage) {
            logInstructionsWarning('instructions index page not found', {
                indexSlug: fetchInstructionsIndexSlug(),
            });
            return [];
        }

        const rootSlug = getResolvedSlug(rootPage);
        const indexSlug = getResolvedSlug(indexPage);
        const indexContent = getNormalizedContent(indexPage);
        const parsedIndexNodes = parseInstructionsIndex(indexContent, rootSlug);

        logInstructionsStage('parsed instructions index', {
            rootSlug,
            indexSlug,
            parsedIndexNodes,
        });

        if (!parsedIndexNodes.length) {
            return [];
        }

        const mappedTree = await buildInstructionsTree(
            parsedIndexNodes,
            (slug) => this.resolveAccessiblePage(slug),
            logInstructionsWarning,
        );

        logInstructionsStage('tree build summary', {
            rootSlug,
            indexSlug,
            mappedTree,
        });

        return mappedTree;
    }

    private async getOrBuildTree(): Promise<InstructionNavNode[]> {
        const now = Date.now();

        if (this.treeCache && this.treeCache.expiresAt > now) {
            return this.treeCache.value;
        }

        const nextTreePromise = (async () => {
            const rootPage = await this.getRootPage();

            if (!rootPage) {
                return [];
            }

            logInstructionsStage('raw Yandex response for /tree root', rootPage);

            return this.buildTreeFromIndex(rootPage);
        })();

        this.treeCache = {
            expiresAt: now + TREE_CACHE_TTL_MS,
            value: nextTreePromise,
        };

        try {
            return await nextTreePromise;
        } catch (error) {
            this.treeCache = null;
            throw error;
        }
    }

    private findNodeBySlug(nodes: InstructionNavNode[], slug: string): InstructionNavNode | null {
        return nodes.reduce<InstructionNavNode | null>((foundNode, node) => {
            if (foundNode) {
                return foundNode;
            }

            if (node.slug === slug) {
                return node;
            }

            return node.children?.length ? this.findNodeBySlug(node.children, slug) : null;
        }, null);
    }

    public async getTree(): Promise<InstructionNavNode[]> {
        const tree = await this.getOrBuildTree();

        logInstructionsStage('mapped /tree response', tree);

        return tree;
    }

    public async getArticleBySlug(slug: string): Promise<InstructionArticle | null> {
        const rootPage = await this.getRootPage();

        if (!rootPage) {
            return null;
        }

        const page = await this.getCachedArticlePage(slug);

        if (!page) {
            return null;
        }

        logInstructionsStage('raw Yandex response for /article', page);

        const tree = await this.getOrBuildTree();
        const node = this.findNodeBySlug(tree, slug);
        const article = mapWikiPageToInstructionArticle(page, rootPage);

        if (node?.type === 'section') {
            const sectionArticle: InstructionArticle = {
                ...article,
                kind: 'section',
                content: article.content === 'Content is missing' ? '' : article.content,
                toc: article.content === 'Content is missing' ? [] : article.toc,
                items: node.children || [],
            };

            logInstructionsStage('mapped /article response', sectionArticle);

            return sectionArticle;
        }

        logInstructionsStage('mapped /article response', article);

        return article;
    }

    public async getFileByPath(slug: string, filePath: string): Promise<WikiFileDto> {
        logInstructionsStage('raw Yandex file request params', { slug, path: filePath });
        const file = await this.client.getFileByPath(slug, filePath);
        logInstructionsStage('mapped /file response', {
            slug,
            path: filePath,
            contentType: file.contentType,
            contentLength: file.contentLength,
            fileName: file.fileName,
        });
        return file;
    }

    public async getExternalLinksFromNoco(): Promise<InstructionExternalLink[]> {
        const now = Date.now();

        if (this.linksCache && this.linksCache.expiresAt > now) {
            return this.linksCache.value;
        }

        const nextPromise = (async () => {
            const pageLimit = 25;
            let offset = 0;
            let hasMore = true;
            const rows: Array<Record<string, unknown>> = [];

            while (hasMore) {
                // eslint-disable-next-line no-await-in-loop
                const payload = await fetchJson<NocoListResponse>(buildNocoRecordsUrl(offset, pageLimit));
                const currentRows = Array.isArray(payload.list) ? payload.list : [];

                if (currentRows.length === 0) {
                    hasMore = false;
                    break;
                }

                rows.push(...currentRows);
                const isLastPage = payload.pageInfo?.isLastPage ?? currentRows.length < pageLimit;

                if (isLastPage) {
                    hasMore = false;
                } else {
                    offset += currentRows.length;
                }
            }

            const links = rows
                .map((row, index) => {
                    const url = pickWikiUrl(row);

                    if (!url) {
                        return null;
                    }

                    const slug = mapWikiUrlToSlug(url);

                    if (!slug) {
                        return null;
                    }

                    const rawId = asString(row.Id ?? row.id ?? row.ID ?? row._id) || `noco-link-${index + 1}`;
                    const title = pickTitle(row);

                    return {
                        id: rawId,
                        title,
                        url,
                        slug,
                    } satisfies InstructionExternalLink;
                })
                .filter((item): item is InstructionExternalLink => Boolean(item));

            const deduped = Array.from(new Map(links.map((item) => [item.url, item])).values());
            this.linksSnapshot = deduped;
            return deduped;
        })();

        this.linksCache = {
            expiresAt: now + LINKS_CACHE_TTL_MS,
            value: nextPromise,
        };

        try {
            return await nextPromise;
        } catch (error) {
            this.linksCache = null;

            if (this.linksSnapshot.length > 0) {
                return this.linksSnapshot;
            }

            throw error;
        }
    }
}
