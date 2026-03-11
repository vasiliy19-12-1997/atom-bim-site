import { InstructionArticle, InstructionNavNode, WikiPageDto } from './types';
import { YandexWikiClient } from './wiki.client';

const FALLBACK_CATEGORY_SLUG = 'wiki';
const FALLBACK_CATEGORY_TITLE = 'Yandex Wiki';

const getResolvedSlug = (page: WikiPageDto): string => String(page.slug || page.supertag || page.id || '').trim();

const getResolvedTitle = (page: WikiPageDto): string => page.title || page.heading || getResolvedSlug(page);

const toArticle = (page: WikiPageDto): InstructionArticle => {
    const resolvedSlug = getResolvedSlug(page);

    return {
        id: String(page.id || resolvedSlug),
        title: getResolvedTitle(page),
        slug: resolvedSlug,
        category: FALLBACK_CATEGORY_SLUG,
        breadcrumbs: [
            {
                title: FALLBACK_CATEGORY_TITLE,
                slug: FALLBACK_CATEGORY_SLUG,
            },
            {
                title: getResolvedTitle(page),
                slug: resolvedSlug,
            },
        ],
        content: page.body?.html || page.body || page.html || '<p>Контент отсутствует</p>',
        contentType: 'html',
        updatedAt: page.updatedAt || page.modifiedAt || page.updated_at,
        toc: [],
    };
};

const parseSeedSlugs = (): string[] => {
    const raw = process.env.YANDEX_WIKI_TREE_SLUGS || process.env.YANDEX_WIKI_ROOT_SLUG || '';
    return raw.split(',').map((value) => value.trim()).filter(Boolean);
};

export class InstructionsRepository {
    private readonly client: YandexWikiClient;

    constructor(client: YandexWikiClient) {
        this.client = client;
    }

    public async getTree(): Promise<InstructionNavNode[]> {
        const seededSlugs = parseSeedSlugs();
        const pages = seededSlugs.length
            ? await this.client.getPagesBySlugs(seededSlugs)
            : await this.client.getPages();

        if (!pages.length) {
            return [];
        }

        const children: InstructionNavNode[] = pages
            .map((page) => ({
                id: String(page.id || getResolvedSlug(page)),
                title: getResolvedTitle(page),
                slug: getResolvedSlug(page),
            }))
            .filter((page) => Boolean(page.slug));

        return [{
            id: FALLBACK_CATEGORY_SLUG,
            slug: FALLBACK_CATEGORY_SLUG,
            title: FALLBACK_CATEGORY_TITLE,
            children,
        }];
    }

    public async getArticleBySlug(slug: string): Promise<InstructionArticle | null> {
        const page = await this.client.getPageBySlug(slug);

        if (!page) {
            return null;
        }

        return toArticle(page);
    }
}
