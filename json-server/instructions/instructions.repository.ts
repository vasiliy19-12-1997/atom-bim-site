import { InstructionArticle, InstructionNavNode, WikiPageDto } from './types';
import { YandexWikiClient } from './wiki.client';

const FALLBACK_CATEGORY_SLUG = 'wiki';
const FALLBACK_CATEGORY_TITLE = 'Yandex Wiki';

const toArticle = (page: WikiPageDto): InstructionArticle => {
    const resolvedSlug = String(page.slug || page.id);

    return {
        id: String(page.id || resolvedSlug),
        title: page.title || resolvedSlug,
        slug: resolvedSlug,
        category: FALLBACK_CATEGORY_SLUG,
        breadcrumbs: [
            {
                title: FALLBACK_CATEGORY_TITLE,
                slug: FALLBACK_CATEGORY_SLUG,
            },
            {
                title: page.title || resolvedSlug,
                slug: resolvedSlug,
            },
        ],
        content: page.body?.html || page.html || '<p>Контент отсутствует</p>',
        contentType: 'html',
        updatedAt: page.updatedAt || page.modifiedAt,
        toc: [],
    };
};

export class InstructionsRepository {
    private readonly client: YandexWikiClient;

    constructor(client: YandexWikiClient) {
        this.client = client;
    }

    public async getTree(): Promise<InstructionNavNode[]> {
        const pages = await this.client.getPages();

        if (!pages.length) {
            return [];
        }

        const children: InstructionNavNode[] = pages.map((page) => ({
            id: String(page.id || page.slug),
            title: page.title || String(page.slug || page.id),
            slug: String(page.slug || page.id),
        }));

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
