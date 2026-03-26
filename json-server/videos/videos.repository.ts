import fs from 'fs';
import path from 'path';
import { request as httpsRequest } from 'https';
import { RutubeResponse, VideoDto } from './types';

const DEFAULT_TIMEOUT = 8000;
const ENDPOINTS = [
    'https://rutube.ru/api/video/person/36353169/',
    'https://rutube.ru/api/video/userchannel/36353169/',
];

const fetchJson = async <T>(url: string): Promise<T> => new Promise((resolve, reject) => {
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

            try {
                resolve(JSON.parse(raw) as T);
            } catch {
                reject(new Error('Invalid Rutube API response'));
            }
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

const mapResponseToVideos = (payload: RutubeResponse, page: number, limit: number): VideoDto[] => {
    const cards = payload.results || [];

    return cards.slice(0, limit).map((card, index) => {
        const id = String(card.id || `rutube-${page}-${index}`);
        const embedOrUrl = card.embed_url || card.video_url || card.absolute_url || '';
        const link = embedOrUrl.startsWith('http') ? embedOrUrl : `https://rutube.ru${embedOrUrl}`;

        return {
            id,
            title: card.title || `Видео ${id}`,
            link,
            type: 'VIDEO_INSTRUCTION',
            section: 'COMMON',
            software: 'REVIT',
        };
    });
};

export const getRutubeVideos = async (page: number, limit: number): Promise<VideoDto[]> => {
    const queries = ENDPOINTS.map((endpoint) => fetchJson<RutubeResponse>(`${endpoint}?format=json&page=${page}`));
    const results = await Promise.allSettled(queries);

    const successful = results
        .filter((item): item is PromiseFulfilledResult<RutubeResponse> => item.status === 'fulfilled')
        .map((item) => mapResponseToVideos(item.value, page, limit))
        .find((videos) => videos.length > 0);

    if (successful) {
        return successful;
    }

    const reasons = results
        .filter((item): item is PromiseRejectedResult => item.status === 'rejected')
        .map((item) => String(item.reason));

    throw new Error(reasons.join('; '));
};

export const getFallbackVideos = (): VideoDto[] => {
    const filePath = path.resolve(__dirname, '../db.json');
    const raw = fs.readFileSync(filePath, 'utf8');
    const db = JSON.parse(raw) as { videos?: VideoDto[] };
    return db.videos || [];
};
