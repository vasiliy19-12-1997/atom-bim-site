import { InstructionArticle, InstructionNavNode, WikiFileDto, WikiPageDto } from './types';
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

export class InstructionsRepository {
    private readonly client: YandexWikiClient;

    private readonly pageCache = new Map<string, Promise<WikiPageDto | null>>();

    private readonly articleCache = new Map<string, Promise<WikiPageDto | null>>();

    private treeCache: { expiresAt: number; value: Promise<InstructionNavNode[]> } | null = null;

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
}
