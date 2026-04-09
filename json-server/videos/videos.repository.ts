import fs from 'fs';
import path from 'path';
import { request as httpRequest } from 'http';
import { request as httpsRequest } from 'https';
import { VideoDto } from './types';

const DEFAULT_TIMEOUT = 8000;
const CACHE_TTL_MS = 12 * 60 * 60 * 1000;
const REFRESH_INTERVAL_MS = 12 * 60 * 60 * 1000;
const CACHE_FILE_PATH = path.resolve(__dirname, 'videos-cache.json');

const DEFAULT_NOCODB_HOST = 'http://tim.atomsk.ru:3000';
const DEFAULT_NOCODB_WORKSPACE_ID = 'wai9abey';
const DEFAULT_NOCODB_BASE_ID = 'p8a9nuessg5k78h';
const DEFAULT_NOCODB_TABLE_ID = 'm2jcg5rzheaqlxw';
const DEFAULT_NOCODB_VIEW_ID = 'vwqbdsi0ekspi90b';

const NOCODB_HOST = (process.env.NOCODB_HOST || process.env.NOCO_DB_BASE_URL || DEFAULT_NOCODB_HOST).replace(/\/$/, '');
const NOCODB_WORKSPACE_ID = process.env.NOCODB_WORKSPACE_ID || DEFAULT_NOCODB_WORKSPACE_ID;
const NOCODB_BASE_ID = process.env.NOCODB_BASE_ID || DEFAULT_NOCODB_BASE_ID;
const NOCODB_TABLE_ID = process.env.NOCODB_TABLE_ID || process.env.NOCO_DB_TABLE_ID || DEFAULT_NOCODB_TABLE_ID;
const NOCODB_VIEW_ID = process.env.NOCODB_VIEW_ID || process.env.NOCO_DB_VIEW_ID || DEFAULT_NOCODB_VIEW_ID;
const NOCODB_API_TOKEN = process.env.NOCODB_API_TOKEN || process.env.NOCO_DB_API_TOKEN || process.env.XC_TOKEN || '';

let cachedVideos: VideoDto[] | null = null;
let cacheTimestamp = 0;
let inFlightVideosPromise: Promise<VideoDto[]> | null = null;
let lastRefreshDiagnostics: Record<string, unknown> = {};

const readVideosCacheFromDisk = (): { videos: VideoDto[]; updatedAt: number } | null => {
    try {
        if (!fs.existsSync(CACHE_FILE_PATH)) {
            return null;
        }

        const raw = fs.readFileSync(CACHE_FILE_PATH, 'utf8');
        const parsed = JSON.parse(raw) as { videos?: VideoDto[]; updatedAt?: number };

        if (!Array.isArray(parsed.videos)) {
            return null;
        }

        return {
            videos: parsed.videos,
            updatedAt: typeof parsed.updatedAt === 'number' ? parsed.updatedAt : 0,
        };
    } catch {
        return null;
    }
};

const saveVideosCacheToDisk = (videos: VideoDto[]) => {
    try {
        fs.writeFileSync(
            CACHE_FILE_PATH,
            JSON.stringify({
                updatedAt: Date.now(),
                videos,
            }),
            'utf8',
        );
    } catch {
        // noop
    }
};

const bootstrapCacheFromDisk = () => {
    const data = readVideosCacheFromDisk();

    if (data && data.videos.length > 0) {
        cachedVideos = data.videos;
        cacheTimestamp = data.updatedAt;
    }
};

bootstrapCacheFromDisk();

const fetchRaw = async (url: string): Promise<string> =>
    new Promise((resolve, reject) => {
        const requester = url.startsWith('https://') ? httpsRequest : httpRequest;

        const req = requester(
            url,
            {
                method: 'GET',
                timeout: DEFAULT_TIMEOUT,
                headers: NOCODB_API_TOKEN
                    ? {
                        'xc-token': NOCODB_API_TOKEN,
                    }
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
                        reject(new Error(`NocoDB API error ${res.statusCode}: ${raw.slice(0, 200)}`));
                        return;
                    }

                    resolve(raw);
                });
            },
        );

        req.on('timeout', () => {
            req.destroy(new Error('NocoDB API timeout'));
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.end();
    });

const fetchJson = async <T>(url: string): Promise<T> => {
    const raw = await fetchRaw(url);

    try {
        return JSON.parse(raw) as T;
    } catch {
        throw new Error('Invalid NocoDB API response');
    }
};

type NocoListResponse = {
    list?: Array<Record<string, unknown>>;
    pageInfo?: {
        totalRows?: number;
        isLastPage?: boolean;
    };
};

const asString = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

const normalizeKey = (key: string): string =>
    key
        .toLowerCase()
        .replace(/\s+/g, '')
        .replace(/[()_./\\-]/g, '');

const hasHttpUrl = (value: string): boolean => /^https?:\/\//i.test(value);
const isRutubeUrl = (value: string): boolean => /^https?:\/\/(?:www\.)?rutube\.ru\//i.test(value);

const normalizeRutubeLink = (value: string): string => {
    const normalized = value.trim();
    const videoMatch = normalized.match(/\/video\/([a-f0-9]{32})\/?/i);

    if (videoMatch) {
        return `https://rutube.ru/play/embed/${videoMatch[1]}`;
    }

    return normalized;
};

const pickRutubeLink = (row: Record<string, unknown>): string => {
    const entries = Object.entries(row)
        .map(([key, value]) => ({ key, normalizedKey: normalizeKey(key), value: asString(value) }))
        .filter((entry) => hasHttpUrl(entry.value) && isRutubeUrl(entry.value));

    if (entries.length === 0) {
        return '';
    }

    const preferred = entries.find((entry) => entry.normalizedKey.includes('путькпубликации'))
        || entries.find((entry) => entry.normalizedKey.includes('publ'))
        || entries.find((entry) => entry.normalizedKey.includes('link'));

    return normalizeRutubeLink(preferred?.value || entries[0].value);
};

const pickTitle = (row: Record<string, unknown>): string => {
    const explicit = [
        'Инструкция',
        'инструкция',
        'Instruction',
        'instruction',
        'title',
        'Title',
        'Название',
        'name',
        'Name',
    ]
        .map((key) => asString(row[key]))
        .find(Boolean);

    if (explicit) {
        return explicit;
    }

    const candidate = Object.entries(row).find(([key, value]) => {
        const normalized = normalizeKey(key);
        return Boolean(asString(value))
            && (normalized.includes('инструкц') || normalized.includes('title') || normalized.includes('name'));
    });

    return candidate ? asString(candidate[1]) : '';
};

const pickValueByKeys = (row: Record<string, unknown>, keys: string[]): string => {
    const normalizedCandidates = keys.map((key) => normalizeKey(key));

    const directMatch = Object.entries(row).find(([key, value]) => {
        const normalizedKey = normalizeKey(key);
        return normalizedCandidates.includes(normalizedKey) && Boolean(asString(value));
    });

    if (directMatch) {
        return asString(directMatch[1]);
    }

    const partialMatch = Object.entries(row).find(([key, value]) => {
        const normalizedKey = normalizeKey(key);
        return Boolean(asString(value)) && normalizedCandidates.some((candidate) => normalizedKey.includes(candidate));
    });

    return partialMatch ? asString(partialMatch[1]) : '';
};

const mapTitleToType = (title?: string): VideoDto['type'] => {
    const normalized = (title || '').toLowerCase();

    if (
        normalized.includes('плагин')
        || normalized.includes('plugin')
        || normalized.includes('диспетчер отделки')
        || normalized.includes('modplus')
    ) {
        return 'PLUGINS';
    }

    if (normalized.includes('вебинар') || normalized.includes('webinar')) {
        return 'WEBINARS';
    }

    return 'VIDEO_INSTRUCTION';
};

const mapSectionValue = (value?: string): VideoDto['section'] | null => {
    const normalized = (value || '').toLowerCase().replace(/\s+/g, '');

    if (!normalized) {
        return null;
    }

    if (normalized === 'ар' || normalized.includes('architect') || normalized.includes('архит')) {
        return 'AR';
    }

    if (normalized === 'кр' || normalized === 'кж' || normalized.includes('конструк')) {
        return 'KR';
    }

    if (normalized === 'ов') {
        return 'OV';
    }

    if (normalized === 'вк') {
        return 'VK';
    }

    if (normalized === 'эл' || normalized === 'электрика') {
        return 'EL';
    }

    if (normalized.includes('common') || normalized.includes('общ')) {
        return 'COMMON';
    }

    return null;
};

const mapTitleToSection = (title?: string): VideoDto['section'] => {
    const normalized = (title || '').toLowerCase();

    if (normalized.includes('армирован')) {
        return 'KR';
    }

    if (normalized.includes('отделк') || normalized.includes('пола') || normalized.includes('кровл')) {
        return 'AR';
    }

    return 'COMMON';
};

const mapSoftwareValue = (value?: string): VideoDto['software'] | null => {
    const normalized = (value || '').toLowerCase().replace(/\s+/g, '');

    if (!normalized) {
        return null;
    }

    if (normalized.includes('autocad') || normalized === 'cad') {
        return 'AUTOCAD';
    }

    if (normalized.includes('revit')) {
        return 'REVIT';
    }

    if (normalized.includes('tangl')) {
        return 'TANGL_VALUE';
    }

    if (normalized.includes('civil3d') || normalized.includes('civil')) {
        return 'CIVIL3D';
    }

    return null;
};

const mapTypeValue = (value?: string): VideoDto['type'] | null => {
    const normalized = (value || '').toLowerCase().replace(/\s+/g, '');

    if (!normalized) {
        return null;
    }

    if (
        normalized.includes('plugin')
        || normalized.includes('плагин')
        || normalized === 'plugins'
        || normalized === 'plugin'
    ) {
        return 'PLUGINS';
    }

    if (normalized.includes('webinar') || normalized.includes('вебинар')) {
        return 'WEBINARS';
    }

    if (
        normalized.includes('инструк')
        || normalized.includes('instruction')
        || normalized.includes('videoinstruction')
    ) {
        return 'VIDEO_INSTRUCTION';
    }

    return null;
};

const mapNocoRowToVideo = (row: Record<string, unknown>, index: number): VideoDto | null => {
    const link = pickRutubeLink(row);

    if (!link) {
        return null;
    }

    const title = pickTitle(row) || `Видео ${index + 1}`;
    const rawId = row.Id ?? row.id ?? row.ID ?? row._id;
    const id = String(rawId || `nocodb-${index + 1}`);
    const typeFromRow = mapTypeValue(
        pickValueByKeys(row, ['Тип', 'Type', 'Категория', 'Category']),
    );
    const sectionFromRow = mapSectionValue(
        pickValueByKeys(row, ['Раздел', 'Section', 'Направление', 'Discipline']),
    );
    const softwareFromRow = mapSoftwareValue(
        pickValueByKeys(row, ['ПО', 'Программа', 'Software', 'Platform']),
    );

    return {
        id,
        title,
        link,
        type: typeFromRow || mapTitleToType(title),
        section: sectionFromRow || mapTitleToSection(title),
        software: softwareFromRow || 'REVIT',
    };
};

const buildNocoRecordsUrl = (offset: number, limit: number): string => {
    const params = new URLSearchParams({
        offset: String(offset),
        limit: String(limit),
    });

    if (NOCODB_VIEW_ID) {
        params.set('viewId', NOCODB_VIEW_ID);
    }

    return `${NOCODB_HOST}/api/v2/tables/${NOCODB_TABLE_ID}/records?${params.toString()}`;
};

const loadNocoRows = async (): Promise<Array<Record<string, unknown>>> => {
    const pageLimit = 200;
    let offset = 0;
    const rows: Array<Record<string, unknown>> = [];

    let hasMore = true;

    while (hasMore) {
        // eslint-disable-next-line no-await-in-loop
        const payload = await fetchJson<NocoListResponse>(buildNocoRecordsUrl(offset, pageLimit));
        const currentRows = Array.isArray(payload.list) ? payload.list : [];

        if (currentRows.length === 0) {
            hasMore = false;
        } else {
            rows.push(...currentRows);

            const isLastPage = payload.pageInfo?.isLastPage ?? currentRows.length < pageLimit;

            if (isLastPage) {
                hasMore = false;
            } else {
                offset += currentRows.length;
            }
        }
    }

    return rows;
};

async function loadFreshRutubeVideos(): Promise<VideoDto[]> {
    const rows = await loadNocoRows();
    const videos = rows
        .map((row, index) => mapNocoRowToVideo(row, index))
        .filter((item): item is VideoDto => Boolean(item));

    if (videos.length === 0) {
        throw new Error('NocoDB returned no usable video links');
    }

    const deduped = Array.from(new Map(videos.map((video) => [video.link, video])).values());

    cachedVideos = deduped;
    cacheTimestamp = Date.now();
    saveVideosCacheToDisk(deduped);

    lastRefreshDiagnostics = {
        updatedAt: cacheTimestamp,
        source: 'nocodb',
        rowsFetched: rows.length,
        videosMapped: videos.length,
        videosAfterDedupe: deduped.length,
        workspaceId: NOCODB_WORKSPACE_ID,
        baseId: NOCODB_BASE_ID,
        tableId: NOCODB_TABLE_ID,
        viewId: NOCODB_VIEW_ID,
    };

    return deduped;
}

const scheduleCacheRefresh = () => {
    setInterval(() => {
        if (inFlightVideosPromise) {
            return;
        }

        inFlightVideosPromise = loadFreshRutubeVideos()
            .catch(() => cachedVideos || [])
            .finally(() => {
                inFlightVideosPromise = null;
            });
    }, REFRESH_INTERVAL_MS);
};

const refreshInBackgroundIfNeeded = () => {
    const cacheIsStale = Date.now() - cacheTimestamp >= CACHE_TTL_MS;

    if (!cacheIsStale || inFlightVideosPromise) {
        return;
    }

    inFlightVideosPromise = loadFreshRutubeVideos()
        .catch(() => cachedVideos || [])
        .finally(() => {
            inFlightVideosPromise = null;
        });
};

export const getRutubeVideos = async (): Promise<VideoDto[]> => {
    if (cachedVideos && cachedVideos.length > 0) {
        refreshInBackgroundIfNeeded();
        return cachedVideos;
    }

    if (inFlightVideosPromise) {
        return inFlightVideosPromise;
    }

    inFlightVideosPromise = loadFreshRutubeVideos().finally(() => {
        inFlightVideosPromise = null;
    });

    return inFlightVideosPromise;
};

export const refreshRutubeVideosCache = async (): Promise<VideoDto[]> => {
    if (inFlightVideosPromise) {
        return inFlightVideosPromise;
    }

    inFlightVideosPromise = loadFreshRutubeVideos().finally(() => {
        inFlightVideosPromise = null;
    });

    return inFlightVideosPromise;
};

export const getRutubeRefreshDiagnostics = () => lastRefreshDiagnostics;

export const getFallbackVideos = (): VideoDto[] => {
    const filePath = path.resolve(__dirname, '../db.json');
    const raw = fs.readFileSync(filePath, 'utf8');
    const db = JSON.parse(raw) as { videos?: VideoDto[] };
    return db.videos || [];
};

scheduleCacheRefresh();
