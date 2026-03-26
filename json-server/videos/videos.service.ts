import { getFallbackVideos, getRutubeVideos } from './videos.repository';
import { VideoDto } from './types';

type QueryParams = {
    page: number;
    limit: number;
    search: string;
    sort: keyof VideoDto;
    order: 'asc' | 'desc';
    type?: VideoDto['type'];
};

export const getVideos = async (params: QueryParams): Promise<VideoDto[]> => {
    const {
        page,
        limit,
        search,
        sort,
        order,
        type,
    } = params;

    let videos: VideoDto[] = [];

    try {
        videos = await getRutubeVideos();
    } catch {
        const fallback = getFallbackVideos();
        const uniqueLinksCount = new Set(fallback.map((item) => item.link)).size;

        if (uniqueLinksCount > 1) {
            videos = fallback;
        } else {
            throw new Error('Rutube is unavailable and local fallback contains non-unique links');
        }
    }

    const normalizedSearch = search.trim().toLowerCase();

    const filtered = videos.filter((video) => {
        const byType = type ? video.type === type : true;
        const bySearch = normalizedSearch.length > 0
            ? video.title.toLowerCase().includes(normalizedSearch)
            : true;

        return byType && bySearch;
    });

    const sorted = filtered.sort((a, b) => {
        const left = String(a[sort] || '').toLowerCase();
        const right = String(b[sort] || '').toLowerCase();
        const compareResult = left.localeCompare(right, 'ru');

        return order === 'asc' ? compareResult : -compareResult;
    });

    const start = (page - 1) * limit;
    return sorted.slice(start, start + limit);
};
