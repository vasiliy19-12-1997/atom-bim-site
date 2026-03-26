import { JsonServerRequest, JsonServerResponse, VideoDto } from './types';
import { getVideos } from './videos.service';

const SORT_FIELDS: Array<keyof VideoDto> = ['id', 'title', 'type', 'section', 'software', 'link'];

export const getVideosController = async (req: JsonServerRequest, res: JsonServerResponse) => {
    try {
        const page = Number(req.query._page || req.query.page || 1);
        const limit = Number(req.query._limit || req.query.limit || 9);
        const search = String(req.query.q || req.query.search || '');
        const requestedSort = String(req.query._sort || req.query.sort || 'title') as keyof VideoDto;
        const sort = SORT_FIELDS.includes(requestedSort) ? requestedSort : 'title';
        const requestedOrder = String(req.query._order || req.query.order || 'asc');
        const order = requestedOrder === 'desc' ? 'desc' : 'asc';
        const requestedType = req.query.type;
        const type = typeof requestedType === 'string' && requestedType.length > 0
            ? (requestedType as VideoDto['type'])
            : undefined;

        const videos = await getVideos({
            page: Number.isFinite(page) && page > 0 ? page : 1,
            limit: Number.isFinite(limit) && limit > 0 ? limit : 9,
            search,
            sort,
            order,
            type,
        });

        res.json(videos);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unexpected videos API error';
        res.status(500).json({ message });
    }
};
