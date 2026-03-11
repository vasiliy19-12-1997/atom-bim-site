import axios, { AxiosError, AxiosInstance } from 'axios';
import { WikiPageDto } from './types';
import { WikiApiError } from './wiki.errors';

interface YandexWikiListResponse {
    results?: WikiPageDto[];
    pages?: WikiPageDto[];
    items?: WikiPageDto[];
}

const DEFAULT_WIKI_HOST = 'https://api.wiki.yandex.net';
const DEFAULT_LIST_PATH = '/api/v2/pages';
const DEFAULT_PAGE_PATH_TEMPLATE = '/api/v2/pages/{slug}';

const mapApiError = (error: unknown, fallbackMessage: string): WikiApiError => {
    if (!axios.isAxiosError(error)) {
        return new WikiApiError(fallbackMessage, 500);
    }

    const axiosError = error as AxiosError<{ message?: string }>;
    const status = axiosError.response?.status || 500;
    const apiMessage = axiosError.response?.data?.message;

    if (status === 401) {
        return new WikiApiError('Yandex Wiki authorization failed (401). Check OAuth token.', 401);
    }

    if (status === 403) {
        return new WikiApiError('Yandex Wiki access denied (403). Check org access and token scope.', 403);
    }

    if (status === 404) {
        return new WikiApiError('Requested Yandex Wiki resource was not found (404).', 404);
    }

    return new WikiApiError(apiMessage || fallbackMessage, status);
};

export class YandexWikiClient {
    private readonly http: AxiosInstance;

    private readonly listPath: string;

    private readonly pagePathTemplate: string;

    constructor() {
        const token = process.env.YANDEX_WIKI_TOKEN;
        const orgId = process.env.YANDEX_WIKI_ORG_ID;

        if (!token || !orgId) {
            throw new WikiApiError('YANDEX_WIKI_TOKEN and YANDEX_WIKI_ORG_ID must be configured in .env', 500);
        }

        this.listPath = process.env.YANDEX_WIKI_LIST_PATH || DEFAULT_LIST_PATH;
        this.pagePathTemplate = process.env.YANDEX_WIKI_PAGE_PATH_TEMPLATE || DEFAULT_PAGE_PATH_TEMPLATE;

        this.http = axios.create({
            baseURL: process.env.YANDEX_WIKI_API_HOST || DEFAULT_WIKI_HOST,
            timeout: 15000,
            headers: {
                Authorization: `OAuth ${token}`,
                'X-Org-Id': orgId,
            },
        });
    }

    public async getPages(): Promise<WikiPageDto[]> {
        try {
            const response = await this.http.get<YandexWikiListResponse | WikiPageDto[]>(this.listPath);
            const payload = response.data;

            if (Array.isArray(payload)) {
                return payload;
            }

            return payload.results || payload.pages || payload.items || [];
        } catch (error) {
            throw mapApiError(error, 'Failed to load Yandex Wiki pages list');
        }
    }

    public async getPageBySlug(slug: string): Promise<WikiPageDto | null> {
        const directPath = this.pagePathTemplate.replace('{slug}', encodeURIComponent(slug));

        try {
            const response = await this.http.get<WikiPageDto>(directPath);
            return response.data;
        } catch (error) {
            const mappedError = mapApiError(error, `Failed to load wiki page "${slug}"`);

            if (mappedError.status !== 404) {
                throw mappedError;
            }
        }

        const pages = await this.getPages();
        return pages.find((page) => page.slug === slug || String(page.id) === slug) || null;
    }
}
