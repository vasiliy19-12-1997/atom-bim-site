import path from 'path';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { WikiFileDto, WikiPageDto } from './types';
import { WikiApiError } from './wiki.errors';

interface YandexWikiPageResponse {
    data?: WikiPageDto;
    page?: WikiPageDto;
    result?: WikiPageDto;
}

interface WikiRequestMeta {
    method: string;
    url: string;
    params?: Record<string, unknown>;
}

const DEFAULT_WIKI_API_HOST = 'https://api.wiki.yandex.net/v1';
const DEFAULT_WIKI_WEB_HOST = 'https://wiki.yandex.ru';
const PAGES_PATH = '/pages';
const DEFAULT_PAGE_FIELDS = ['breadcrumbs'];
const ARTICLE_PAGE_FIELDS = ['content', 'breadcrumbs', 'attributes'];
const IMAGE_CONTENT_TYPE_BY_EXT: Record<string, string> = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.bmp': 'image/bmp',
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
    requestMeta: WikiRequestMeta,
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

const logWikiResponse = (
    context: string,
    requestMeta: WikiRequestMeta,
    responseMeta: {
        status: number;
        statusText: string;
        responseBody: unknown;
    },
) => {
    // eslint-disable-next-line no-console
    console.info(`[wiki] ${context}`, {
        request: requestMeta,
        response: responseMeta,
    });
};

const mapApiError = (error: unknown, fallbackMessage: string, requestMeta: WikiRequestMeta): WikiApiError => {
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

const normalizeFields = (fields?: string[]) => fields?.filter(Boolean).join(',');

const decodeSegment = (segment: string) => {
    try {
        return decodeURIComponent(segment);
    } catch {
        return segment;
    }
};

const extractMarkdownTarget = (rawPath: string) => {
    const trimmed = rawPath.trim();
    const sizeMatch = trimmed.match(/\s+=\s*(\d*)x(\d*)\s*$/i);
    const cleanPath = sizeMatch ? trimmed.slice(0, sizeMatch.index).trim() : trimmed;

    return cleanPath;
};

const encodeWikiPath = (rawPath: string) => {
    const normalizedPath = rawPath
        .split('/')
        .filter(Boolean)
        .map((segment) => encodeURIComponent(decodeSegment(segment)))
        .join('/');

    return `/${normalizedPath}`;
};

const resolveFilePath = (slug: string, rawPath: string) => {
    const cleanedPath = extractMarkdownTarget(rawPath);

    if (!cleanedPath) {
        throw new WikiApiError('Instruction file path is required', 400);
    }

    if (cleanedPath.startsWith('/')) {
        return encodeWikiPath(cleanedPath);
    }

    const normalizedRelativePath = cleanedPath.replace(/^\.\//, '');
    const slugPath = slug
        .split('/')
        .filter(Boolean)
        .map((segment) => decodeSegment(segment))
        .join('/');

    return encodeWikiPath(`${slugPath}/${normalizedRelativePath}`);
};

const inferContentType = (filePath: string, contentType?: string) => {
    if (contentType && contentType !== 'application/octet-stream') {
        return contentType;
    }

    return IMAGE_CONTENT_TYPE_BY_EXT[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
};

export class YandexWikiClient {
    private readonly apiHttp: AxiosInstance;

    private readonly fileHttp: AxiosInstance;

    constructor() {
        const token = process.env.YANDEX_WIKI_TOKEN;
        const orgId = process.env.YANDEX_WIKI_ORG_ID;

        if (!token || !orgId) {
            throw new WikiApiError(
                'YANDEX_WIKI_TOKEN and YANDEX_WIKI_ORG_ID are required. Add them to .env before starting backend.',
                500,
            );
        }

        const sharedHeaders = {
            Authorization: `OAuth ${token}`,
            'X-Org-Id': orgId,
        };

        this.apiHttp = axios.create({
            baseURL: process.env.YANDEX_WIKI_API_HOST || DEFAULT_WIKI_API_HOST,
            timeout: 15000,
            headers: sharedHeaders,
        });

        this.fileHttp = axios.create({
            baseURL: process.env.YANDEX_WIKI_WEB_HOST || DEFAULT_WIKI_WEB_HOST,
            timeout: 15000,
            headers: sharedHeaders,
            responseType: 'arraybuffer',
        });
    }

    private async getPage(requestMeta: WikiRequestMeta): Promise<WikiPageDto | null> {
        try {
            const response = await this.apiHttp.get<YandexWikiPageResponse | WikiPageDto>(requestMeta.url, {
                params: requestMeta.params,
            });

            logWikiResponse('page request completed', requestMeta, {
                status: response.status,
                statusText: response.statusText,
                responseBody: response.data,
            });

            return pickPage(response.data);
        } catch (error) {
            const identifier = requestMeta.params?.slug || requestMeta.url;
            const mappedError = mapApiError(error, `Failed to load wiki page "${identifier}"`, requestMeta);

            if (mappedError.status === 404) {
                return null;
            }

            throw mappedError;
        }
    }

    public async getPageBySlug(slug: string, fields: string[] = DEFAULT_PAGE_FIELDS): Promise<WikiPageDto | null> {
        const normalizedSlug = slug.trim();

        if (!normalizedSlug) {
            throw new WikiApiError('Yandex Wiki slug is required for /pages request', 500);
        }

        return this.getPage({
            method: 'GET',
            url: PAGES_PATH,
            params: {
                slug: normalizedSlug,
                fields: normalizeFields(fields),
            },
        });
    }

    public async getPageById(id: string | number, fields: string[] = ARTICLE_PAGE_FIELDS): Promise<WikiPageDto | null> {
        const normalizedId = String(id).trim();

        if (!normalizedId) {
            throw new WikiApiError('Yandex Wiki page id is required for detail request', 500);
        }

        return this.getPage({
            method: 'GET',
            url: `${PAGES_PATH}/${normalizedId}`,
            params: {
                fields: normalizeFields(fields),
            },
        });
    }

    public async getArticlePageBySlug(slug: string): Promise<WikiPageDto | null> {
        const page = await this.getPageBySlug(slug, ARTICLE_PAGE_FIELDS);

        if (!page) {
            return null;
        }

        const hasContent = Boolean(
            page.content
            || page.body
            || page.html,
        );

        if (hasContent || !page.id) {
            return page;
        }

        return this.getPageById(page.id, ARTICLE_PAGE_FIELDS);
    }

    public async getPagesBySlugs(slugs: string[]): Promise<WikiPageDto[]> {
        const pages = await Promise.all(slugs.map((slug) => this.getPageBySlug(slug)));
        return pages.filter((page): page is WikiPageDto => Boolean(page));
    }

    public async getFileByPath(slug: string, rawPath: string): Promise<WikiFileDto> {
        const resolvedPath = resolveFilePath(slug, rawPath);
        const requestMeta: WikiRequestMeta = {
            method: 'GET',
            url: `${this.fileHttp.defaults.baseURL || ''}${resolvedPath}`,
        };

        try {
            const response = await this.fileHttp.get<ArrayBuffer>(resolvedPath);
            const contentTypeHeader = String(response.headers['content-type'] || '');

            logWikiResponse('file request completed', requestMeta, {
                status: response.status,
                statusText: response.statusText,
                responseBody: {
                    contentType: contentTypeHeader,
                    contentLength: response.headers['content-length'],
                },
            });

            if (contentTypeHeader.includes('application/json')) {
                throw new WikiApiError('Yandex Wiki file request returned JSON instead of binary asset', 502);
            }

            return {
                body: Buffer.from(response.data),
                contentType: inferContentType(resolvedPath, contentTypeHeader),
                contentLength: response.headers['content-length'],
                cacheControl: response.headers['cache-control'],
                fileName: path.basename(resolvedPath),
            };
        } catch (error) {
            if (error instanceof WikiApiError) {
                throw error;
            }

            throw mapApiError(error, `Failed to load wiki file "${resolvedPath}"`, requestMeta);
        }
    }
}
