import axios, { AxiosError, AxiosInstance } from 'axios';
import { WikiPageDto } from './types';
import { WikiApiError } from './wiki.errors';

interface YandexWikiListResponse {
    results?: WikiPageDto[];
    pages?: WikiPageDto[];
    items?: WikiPageDto[];
    data?: WikiPageDto[];
}

interface YandexWikiPageResponse {
    data?: WikiPageDto;
    page?: WikiPageDto;
    result?: WikiPageDto;
}

const DEFAULT_WIKI_HOST = 'https://api.wiki.yandex.net/v1';
const PAGES_PATH = '/pages';

const pickPageList = (payload: YandexWikiListResponse | WikiPageDto[]): WikiPageDto[] => {
    if (Array.isArray(payload)) {
        return payload;
    }

    return payload.results || payload.pages || payload.items || payload.data || [];
};

const pickPage = (payload: WikiPageDto | YandexWikiPageResponse): WikiPageDto | null => {
    if (!payload || typeof payload !== 'object') {
        return null;
    }

    const wrapped = payload as YandexWikiPageResponse;
    return wrapped.data || wrapped.page || wrapped.result || (payload as WikiPageDto);
};

const logWikiError = (
    context: string,
    requestMeta: { method: string; url: string; params?: unknown },
    errorMeta: {
        message?: string;
        code?: string;
        cause?: unknown;
        status?: number;
        statusText?: string;
        responseData?: unknown;
    },
) => {
    // eslint-disable-next-line no-console
    console.error(`[wiki] ${context}`, {
        request: requestMeta,
        error: errorMeta,
    });
};

const mapApiError = (error: unknown, fallbackMessage: string, requestMeta: { method: string; url: string; params?: unknown }): WikiApiError => {
    if (!axios.isAxiosError(error)) {
        const nonAxiosError = error as Error & { code?: string; cause?: unknown };

        logWikiError('local backend error', requestMeta, {
            message: nonAxiosError?.message || fallbackMessage,
            code: nonAxiosError?.code,
            cause: nonAxiosError?.cause,
        });

        return new WikiApiError(nonAxiosError?.message || fallbackMessage, 500);
    }

    const axiosError = error as AxiosError<{ message?: string; error?: string }>;

    logWikiError('axios request failed', requestMeta, {
        message: axiosError.message,
        code: axiosError.code,
        cause: axiosError.cause,
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        responseData: axiosError.response?.data,
    });

    if (axiosError.response) {
        const { status, data } = axiosError.response;
        const apiMessage = data?.message || data?.error;

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
    }

    return new WikiApiError('Yandex Wiki network error. Unable to get response from API.', 502);
};

export class YandexWikiClient {
    private readonly http: AxiosInstance;

    constructor() {
        const token = process.env.YANDEX_WIKI_TOKEN;
        const orgId = process.env.YANDEX_WIKI_ORG_ID;

        if (!token || !orgId) {
            throw new WikiApiError(
                'YANDEX_WIKI_TOKEN and YANDEX_WIKI_ORG_ID are required. Add them to .env before starting backend.',
                500,
            );
        }

        this.http = axios.create({
            baseURL: process.env.YANDEX_WIKI_API_HOST || DEFAULT_WIKI_HOST,
            timeout: 15000,
            headers: {
                Authorization: `OAuth ${token}`,
                'X-Org-Id': orgId,
            },
        });
    }

    public async getPageBySlug(slug: string): Promise<WikiPageDto | null> {
        const requestMeta = {
            method: 'GET',
            url: `${this.http.defaults.baseURL || ''}${PAGES_PATH}`,
            params: { slug },
        };

        try {
            const response = await this.http.get<YandexWikiPageResponse | WikiPageDto>(PAGES_PATH, {
                params: { slug },
            });

            return pickPage(response.data);
        } catch (error) {
            const mappedError = mapApiError(error, `Failed to load wiki page "${slug}"`, requestMeta);

            if (mappedError.status === 404) {
                return null;
            }

            throw mappedError;
        }
    }

    public async getPagesBySlugs(slugs: string[]): Promise<WikiPageDto[]> {
        const pages = await Promise.all(slugs.map((slug) => this.getPageBySlug(slug)));
        return pages.filter((page): page is WikiPageDto => Boolean(page));
    }

    public async getPages(): Promise<WikiPageDto[]> {
        const requestMeta = {
            method: 'GET',
            url: `${this.http.defaults.baseURL || ''}${PAGES_PATH}`,
        };

        try {
            const response = await this.http.get<YandexWikiListResponse | WikiPageDto[]>(PAGES_PATH);
            return pickPageList(response.data);
        } catch (error) {
            throw mapApiError(error, 'Failed to load Yandex Wiki pages list', requestMeta);
        }
    }
}
