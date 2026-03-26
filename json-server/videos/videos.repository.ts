import fs from 'fs';
import path from 'path';
import { request as httpsRequest } from 'https';
import { RutubeCard, RutubeListResponse, RutubePlaylist, VideoDto } from './types';

const DEFAULT_TIMEOUT = 8000;
const MAX_PAGES = 200;
const CHANNEL_VIDEOS_URL = 'https://rutube.ru/channel/36353169/videos/';

const VIDEO_ENDPOINTS = [
    'https://rutube.ru/api/video/person/36353169/',
    'https://rutube.ru/api/video/userchannel/36353169/',
];

const PLAYLIST_ENDPOINTS = [
    'https://rutube.ru/api/playlist/person/36353169/',
    'https://rutube.ru/api/playlist/userchannel/36353169/',
];

const fetchRaw = async (url: string): Promise<string> => new Promise((resolve, reject) => {
    const request = httpsRequest(url, { method: 'GET', timeout: DEFAULT_TIMEOUT }, (response) => {
        const chunks: Buffer[] = [];

        response.on('data', (chunk) => {
            chunks.push(Buffer.from(chunk));
        });

        response.on('end', () => {
            const raw = Buffer.concat(chunks).toString('utf8');

            if (response.statusCode && response.statusCode >= 400) {
                reject(new Error(`Rutube API error ${response.statusCode}`));
                return;
            }

            resolve(raw);
        });
    });

    request.on('timeout', () => {
        request.destroy(new Error('Rutube API timeout'));
    });

    request.on('error', (error) => {
        reject(error);
    });

    request.end();
});

const fetchJson = async <T>(url: string): Promise<T> => {
    const raw = await fetchRaw(url);

    try {
        return JSON.parse(raw) as T;
    } catch {
        throw new Error('Invalid Rutube API response');
    }
};

const normalizeApiUrl = (url: string): string => {
    if (url.startsWith('http')) {
        return url;
    }

    return `https://rutube.ru${url}`;
};

const appendFormatAndPage = (url: string, page: number): string => {
    const divider = url.includes('?') ? '&' : '?';
    return `${url}${divider}format=json&page=${page}`;
};

const fetchAllFromPagedEndpoint = async <T>(endpoint: string): Promise<T[]> => {
    const fetchPage = async (page: number, nextUrl?: string | null): Promise<T[]> => {
        if (page > MAX_PAGES) {
            return [];
        }

        const url = nextUrl ? normalizeApiUrl(nextUrl) : appendFormatAndPage(endpoint, page);
        const payload = await fetchJson<RutubeListResponse<T>>(url);
        const current = payload.results || [];

        if (current.length === 0) {
            return [];
        }

        const nextItems = payload.next ? await fetchPage(page + 1, payload.next) : await fetchPage(page + 1);
        return [...current, ...nextItems];
    };

    return fetchPage(1);
};

const decodeHtml = (value: string): string => value
    .replace(/\\u002F/g, '/')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');

const extractCardsFromChannelHtml = (html: string): RutubeCard[] => {
    const titleById: Record<string, string> = {};
    const titleFirstPattern = /"title":"([^"\\]*(?:\\.[^"\\]*)*)"[^{}]{0,800}?\/video\/([a-f0-9]{32})\//gi;
    let titleMatch = titleFirstPattern.exec(html);

    while (titleMatch) {
        const [, rawTitle, id] = titleMatch;
        titleById[id] = decodeHtml(rawTitle);
        titleMatch = titleFirstPattern.exec(html);
    }

    const videoFirstPattern = /\/video\/([a-f0-9]{32})\/[^{}]{0,800}?"title":"([^"\\]*(?:\\.[^"\\]*)*)"/gi;
    let videoFirstMatch = videoFirstPattern.exec(html);

    while (videoFirstMatch) {
        const [, id, rawTitle] = videoFirstMatch;
        if (!titleById[id]) {
            titleById[id] = decodeHtml(rawTitle);
        }
        videoFirstMatch = videoFirstPattern.exec(html);
    }

    const ids = Array.from(new Set(Array.from(html.matchAll(/\/video\/([a-f0-9]{32})\//gi)).map((match) => match[1])));

    return ids.map((id) => ({
        id,
        title: titleById[id] || `Видео ${id}`,
        embed_url: `/play/embed/${id}`,
    }));
};

const getChannelVideosByHtml = async (): Promise<RutubeCard[]> => {
    const fetchPages = async (page: number): Promise<RutubeCard[]> => {
        if (page > MAX_PAGES) {
            return [];
        }

        const url = `${CHANNEL_VIDEOS_URL}?page=${page}`;
        const html = await fetchRaw(url);
        const cards = extractCardsFromChannelHtml(html);

        if (cards.length === 0) {
            return [];
        }

        const next = await fetchPages(page + 1);
        return [...cards, ...next];
    };

    const cards = await fetchPages(1);
    return Array.from(new Map(cards.map((card, index) => [String(card.id || `idx-${index}`), card])).values());
};

const mapPlaylistNameToType = (name?: string): VideoDto['type'] => {
    const normalized = (name || '').toLowerCase();

    if (normalized.includes('плагин') || normalized.includes('plugin')) {
        return 'PLUGINS';
    }

    if (normalized.includes('вебинар') || normalized.includes('webinar')) {
        return 'WEBINARS';
    }

    return 'VIDEO_INSTRUCTION';
};

const mapVideoTitleToType = (title?: string): VideoDto['type'] => {
    const normalized = (title || '').toLowerCase();

    if (normalized.includes('плагин') || normalized.includes('plugin')) {
        return 'PLUGINS';
    }

    if (normalized.includes('вебинар') || normalized.includes('webinar')) {
        return 'WEBINARS';
    }

    return 'VIDEO_INSTRUCTION';
};

const extractPlaylistVideoIds = (playlist: RutubePlaylist): string[] => {
    const fromVideoIds = (playlist.video_ids || []).map((id) => String(id));

    const fromVideos = (playlist.videos || [])
        .map((item) => {
            if (typeof item === 'string' || typeof item === 'number') {
                return String(item);
            }

            if (typeof item === 'object' && item && 'id' in item && item.id !== undefined) {
                return String(item.id);
            }

            return '';
        })
        .filter(Boolean);

    return [...fromVideoIds, ...fromVideos];
};

const buildPlaylistVideoEndpoints = (playlist: RutubePlaylist): string[] => {
    const id = playlist.id ? String(playlist.id) : '';
    const apiUrl = playlist.api_url ? normalizeApiUrl(playlist.api_url) : '';
    const videosUrl = playlist.videos_url ? normalizeApiUrl(playlist.videos_url) : '';
    const videoUrl = playlist.video_url ? normalizeApiUrl(playlist.video_url) : '';

    const candidates = [
        videosUrl,
        videoUrl,
        apiUrl ? `${apiUrl.replace(/\/$/, '')}/videos/` : '',
        id ? `https://rutube.ru/api/playlist/custom/${id}/videos/` : '',
        id ? `https://rutube.ru/api/playlist/${id}/videos/` : '',
    ];

    return candidates.filter(Boolean);
};

const collectPlaylistTypeMap = async (): Promise<Record<string, VideoDto['type']>> => {
    const map: Record<string, VideoDto['type']> = {};

    const playlistResponses = await Promise.allSettled(PLAYLIST_ENDPOINTS.map((endpoint) => fetchAllFromPagedEndpoint<RutubePlaylist>(endpoint)));

    const playlists = playlistResponses
        .filter((result): result is PromiseFulfilledResult<RutubePlaylist[]> => result.status === 'fulfilled')
        .flatMap((result) => result.value);

    const addToMap = (videoIds: string[], type: VideoDto['type']) => {
        videoIds.forEach((videoId) => {
            if (!map[videoId]) {
                map[videoId] = type;
            }
        });
    };

    await Promise.all(playlists.map(async (playlist) => {
        const type = mapPlaylistNameToType(playlist.title || playlist.name);

        const inlineVideoIds = extractPlaylistVideoIds(playlist);
        addToMap(inlineVideoIds, type);

        if (inlineVideoIds.length > 0) {
            return;
        }

        const endpoints = buildPlaylistVideoEndpoints(playlist);

        const results = await Promise.allSettled(endpoints.map((endpoint) => fetchAllFromPagedEndpoint<RutubeCard>(endpoint)));

        const ids = results
            .filter((result): result is PromiseFulfilledResult<RutubeCard[]> => result.status === 'fulfilled')
            .flatMap((result) => result.value)
            .map((video) => (video.id !== undefined ? String(video.id) : ''))
            .filter(Boolean);

        addToMap(ids, type);
    }));

    return map;
};

const mapVideoCard = (card: RutubeCard, playlistTypeMap: Record<string, VideoDto['type']>, index: number): VideoDto => {
    const id = String(card.id || `rutube-${index}`);
    const embedOrUrl = card.embed_url || card.video_url || card.absolute_url || `/play/embed/${id}`;
    const link = embedOrUrl.startsWith('http') ? embedOrUrl : `https://rutube.ru${embedOrUrl}`;

    return {
        id,
        title: card.title || `Видео ${id}`,
        link,
        type: playlistTypeMap[id] || mapVideoTitleToType(card.title),
        section: 'COMMON',
        software: 'REVIT',
    };
};

export const getRutubeVideos = async (): Promise<VideoDto[]> => {
    const videoResponses = await Promise.allSettled(VIDEO_ENDPOINTS.map((endpoint) => fetchAllFromPagedEndpoint<RutubeCard>(endpoint)));

    const apiCards = videoResponses
        .filter((result): result is PromiseFulfilledResult<RutubeCard[]> => result.status === 'fulfilled')
        .flatMap((result) => result.value);

    const cards = apiCards.length > 0 ? apiCards : await getChannelVideosByHtml();

    if (cards.length === 0) {
        const errors = videoResponses
            .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
            .map((result) => String(result.reason));

        throw new Error(errors.join('; '));
    }

    const playlistTypeMap = await collectPlaylistTypeMap().catch(() => ({}));
    const dedupedCards = Array.from(new Map(cards.map((card, index) => [String(card.id || `idx-${index}`), card])).values());

    return dedupedCards.map((card, index) => mapVideoCard(card, playlistTypeMap, index));
};

export const getFallbackVideos = (): VideoDto[] => {
    const filePath = path.resolve(__dirname, '../db.json');
    const raw = fs.readFileSync(filePath, 'utf8');
    const db = JSON.parse(raw) as { videos?: VideoDto[] };
    return db.videos || [];
};
