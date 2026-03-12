import { InstructionArticle, InstructionNavNode, WikiFileDto, WikiPageDto } from './types';
import { SECTION_CHILDREN_CONFIG } from './section-children.config';
import { YandexWikiClient } from './wiki.client';
import { WikiApiError } from './wiki.errors';
import {
    collectEmbeddedPages,
    extractWikiLinkSlugsFromMarkdown,
    getNormalizedContent,
    getResolvedSlug,
    mapInstructionSectionSlugToTitle,
    mapWikiPageToInstructionArticle,
    mapWikiPageToInstructionNode,
} from './wiki.mapper';

const getRootSlug = (): string => String(process.env.YANDEX_WIKI_ROOT_SLUG || '').trim();

const logInstructionsStage = (context: string, payload: unknown) => {
    // eslint-disable-next-line no-console
    console.info(`[instructions] ${context}`, payload);
};

const logInstructionsWarning = (context: string, payload: unknown) => {
    // eslint-disable-next-line no-console
    console.warn(`[instructions] ${context}`, payload);
};

const isAccessDeniedError = (error: unknown): error is WikiApiError => error instanceof WikiApiError && error.status === 403;
const getConfiguredSectionChildren = (sectionSlug: string): string[] => SECTION_CHILDREN_CONFIG[sectionSlug] || [];
const getConfiguredSectionSlugs = (): string[] => Object.keys(SECTION_CHILDREN_CONFIG);

const getDuplicateValues = (values: string[]): string[] => {
    const counts = new Map<string, number>();

    values.forEach((value) => {
        counts.set(value, (counts.get(value) || 0) + 1);
    });

    return Array.from(counts.entries())
        .filter(([, count]) => count > 1)
        .map(([value]) => value);
};

const validateSectionChildrenConfig = (sectionSlugs: string[]) => {
    const configuredSectionSlugs = getConfiguredSectionSlugs();
    const unknownSectionSlugs = configuredSectionSlugs.filter((slug) => !sectionSlugs.includes(slug));
    const duplicateChildSlugs = getDuplicateValues(
        configuredSectionSlugs.flatMap((sectionSlug) => getConfiguredSectionChildren(sectionSlug)),
    );

    if (unknownSectionSlugs.length || duplicateChildSlugs.length) {
        throw new WikiApiError(
            `Invalid SECTION_CHILDREN_CONFIG. Unknown sections: ${unknownSectionSlugs.join(', ') || 'none'}. `
            + `Duplicate child slugs: ${duplicateChildSlugs.join(', ') || 'none'}.`,
            500,
        );
    }
};

export class InstructionsRepository {
    private readonly client: YandexWikiClient;

    constructor(client: YandexWikiClient) {
        this.client = client;
    }

    private async getRootPage(): Promise<WikiPageDto | null> {
        const rootSlug = getRootSlug();

        if (!rootSlug) {
            throw new WikiApiError('Yandex Wiki root slug is not configured', 500);
        }

        return this.client.getArticlePageBySlug(rootSlug);
    }

    private async loadAccessiblePagesBySlugs(
        slugs: string[],
        context: { parentSlug: string; type: 'section' | 'child' },
    ): Promise<{ pages: WikiPageDto[]; loadedSlugs: string[]; skippedSlugs: string[] }> {
        const settledPages = await Promise.allSettled(slugs.map((slug) => this.client.getPageBySlug(slug)));
        const loadedSlugs: string[] = [];
        const skippedSlugs: string[] = [];
        const pages = settledPages.flatMap((result, index) => {
            const slug = slugs[index];

            if (result.status === 'fulfilled') {
                if (result.value) {
                    loadedSlugs.push(slug);
                    return [result.value];
                }

                skippedSlugs.push(slug);
                return [];
            }

            if (isAccessDeniedError(result.reason)) {
                skippedSlugs.push(slug);
                logInstructionsWarning(`skipped ${context.type} page due to 403`, {
                    parentSlug: context.parentSlug,
                    slug,
                    message: result.reason.message,
                });
                return [];
            }

            throw result.reason;
        });

        return {
            pages,
            loadedSlugs,
            skippedSlugs,
        };
    }

    private async resolveSectionChildren(sectionPage: WikiPageDto, rootPage: WikiPageDto): Promise<InstructionNavNode[]> {
        const sectionSlug = getResolvedSlug(sectionPage);
        const configuredChildren = getConfiguredSectionChildren(sectionSlug);

        if (configuredChildren.length) {
            const { pages, loadedSlugs, skippedSlugs } = await this.loadAccessiblePagesBySlugs(configuredChildren, {
                parentSlug: sectionSlug,
                type: 'child',
            });
            const children = pages
                .map((page) => mapWikiPageToInstructionNode(page))
                .sort((left, right) => left.title.localeCompare(right.title, 'ru'));

            logInstructionsStage('section tree load result', {
                sectionSlug,
                strategy: 'config',
                childSlugs: configuredChildren,
                loadedChildSlugs: loadedSlugs,
                skippedChildSlugs: skippedSlugs,
            });

            return children;
        }

        const embeddedPages = collectEmbeddedPages(sectionPage)
            .filter((page) => {
                const slug = getResolvedSlug(page);
                return slug.startsWith(`${sectionSlug}/`);
            });
        const uniqueEmbeddedPages = Array.from(new Map(
            embeddedPages.map((page) => [getResolvedSlug(page), page]),
        ).values());

        if (uniqueEmbeddedPages.length) {
            logInstructionsStage('resolved section children from API payload', {
                sectionSlug,
                strategy: 'api-embedded-fallback',
                loadedChildSlugs: uniqueEmbeddedPages.map((page) => getResolvedSlug(page)),
            });

            return uniqueEmbeddedPages
                .map((page) => mapWikiPageToInstructionNode(page))
                .sort((left, right) => left.title.localeCompare(right.title, 'ru'));
        }

        const sectionArticle = mapWikiPageToInstructionArticle(sectionPage, rootPage);
        const discoveredChildSlugs = extractWikiLinkSlugsFromMarkdown(sectionArticle.content, sectionSlug)
            .filter((slug) => slug.startsWith(`${sectionSlug}/`) && slug !== sectionSlug);

        if (!discoveredChildSlugs.length) {
            logInstructionsStage('section has no resolved children', {
                sectionSlug,
                strategy: 'config',
            });
            return [];
        }

        const { pages, loadedSlugs, skippedSlugs } = await this.loadAccessiblePagesBySlugs(discoveredChildSlugs, {
            parentSlug: sectionSlug,
            type: 'child',
        });
        const children = pages
            .map((page) => mapWikiPageToInstructionNode(page))
            .sort((left, right) => left.title.localeCompare(right.title, 'ru'));

        logInstructionsStage('section tree load result', {
            sectionSlug,
            strategy: 'markdown-fallback',
            childSlugs: discoveredChildSlugs,
            loadedChildSlugs: loadedSlugs,
            skippedChildSlugs: skippedSlugs,
        });

        return children;
    }

    private async buildTreeFromRoot(rootPage: WikiPageDto): Promise<InstructionNavNode[]> {
        const rootSlug = getResolvedSlug(rootPage);
        const rootContent = getNormalizedContent(rootPage);
        const sectionSlugs = extractWikiLinkSlugsFromMarkdown(rootContent, rootSlug)
            .filter((slug) => slug.startsWith(`${rootSlug}/`) && slug !== rootSlug);

        logInstructionsStage('parsed section slugs from root markdown', {
            rootSlug,
            rootContent,
            sectionSlugs,
        });

        if (!sectionSlugs.length) {
            return [];
        }

        validateSectionChildrenConfig(sectionSlugs);

        const skippedSectionSlugs: string[] = [];
        const loadedSectionSlugs: string[] = [];
        const settledSections = await Promise.allSettled(sectionSlugs.map(async (sectionSlug) => {
            const sectionPage = await this.client.getArticlePageBySlug(sectionSlug);

            if (!sectionPage) {
                return null;
            }

            const children = await this.resolveSectionChildren(sectionPage, rootPage);

            return {
                id: String(sectionPage.id || getResolvedSlug(sectionPage)),
                title: mapInstructionSectionSlugToTitle(sectionSlug),
                slug: getResolvedSlug(sectionPage),
                children,
            } as InstructionNavNode;
        }));

        const sections = settledSections.flatMap((result, index) => {
            const sectionSlug = sectionSlugs[index];

            if (result.status === 'fulfilled') {
                if (result.value) {
                    loadedSectionSlugs.push(sectionSlug);
                    return [result.value];
                }

                skippedSectionSlugs.push(sectionSlug);
                return [];
            }

            if (isAccessDeniedError(result.reason)) {
                skippedSectionSlugs.push(sectionSlug);
                logInstructionsWarning('skipped section due to 403', {
                    sectionSlug,
                    message: result.reason.message,
                });
                return [];
            }

            throw result.reason;
        });

        logInstructionsStage('tree section load summary', {
            parsedSectionSlugs: sectionSlugs,
            loadedSectionSlugs,
            skippedSectionSlugs,
        });

        return sections;
    }

    public async getTree(): Promise<InstructionNavNode[]> {
        const rootPage = await this.getRootPage();

        if (!rootPage) {
            return [];
        }

        logInstructionsStage('raw Yandex response for /tree', rootPage);

        const mappedTree = await this.buildTreeFromRoot(rootPage);

        logInstructionsStage('mapped /tree response', {
            rootSlug: getResolvedSlug(rootPage),
            mappedTree,
        });

        return mappedTree;
    }

    public async getArticleBySlug(slug: string): Promise<InstructionArticle | null> {
        const rootPage = await this.getRootPage();

        if (!rootPage) {
            return null;
        }

        const page = await this.client.getArticlePageBySlug(slug);

        if (!page) {
            return null;
        }

        logInstructionsStage('raw Yandex response for /article', page);

        const tree = await this.buildTreeFromRoot(rootPage);
        const sectionNode = tree.find((node) => node.slug === slug);
        const article = mapWikiPageToInstructionArticle(page, rootPage);

        if (sectionNode) {
            const sectionArticle = {
                ...article,
                kind: 'section' as const,
                content: article.content === 'Content is missing' ? '' : article.content,
                toc: article.content === 'Content is missing' ? [] : article.toc,
                items: sectionNode.children || [],
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
