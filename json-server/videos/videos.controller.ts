import { JsonServerRequest, JsonServerResponse, VideoDto } from './types';
import { getVideos } from './videos.service';
import { refreshRutubeVideosCache } from './videos.repository';

const SORT_FIELDS: Array<keyof VideoDto> = ['id', 'title', 'type', 'section', 'software', 'link'];
const TYPE_VALUES: Array<VideoDto['type']> = ['VIDEO_INSTRUCTION', 'WEBINARS', 'PLUGINS'];
const SECTION_VALUES: Array<VideoDto['section']> = ['COMMON', 'AR', 'KR', 'OV', 'VK', 'EL'];
const SOFTWARE_VALUES: Array<VideoDto['software']> = ['AUTOCAD', 'REVIT', 'TANGL_VALUE', 'CIVIL3D'];

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
        const requestedSection = req.query.section;
        const requestedSoftware = req.query.software;
        const requestedFilter = req.query.filter;
        const validFilter = typeof requestedFilter === 'string' && requestedFilter.length > 0
            ? requestedFilter
            : undefined;
        const typeCandidate = typeof requestedType === 'string' && requestedType.length > 0 ? requestedType : validFilter;
        const sectionCandidate = typeof requestedSection === 'string' && requestedSection.length > 0
            ? requestedSection
            : validFilter;
        const softwareCandidate = typeof requestedSoftware === 'string' && requestedSoftware.length > 0
            ? requestedSoftware
            : validFilter;

        const type = typeCandidate && TYPE_VALUES.includes(typeCandidate as VideoDto['type'])
            ? (typeCandidate as VideoDto['type'])
            : undefined;
        const section = sectionCandidate && SECTION_VALUES.includes(sectionCandidate as VideoDto['section'])
            ? (sectionCandidate as VideoDto['section'])
            : undefined;
        const software = softwareCandidate && SOFTWARE_VALUES.includes(softwareCandidate as VideoDto['software'])
            ? (softwareCandidate as VideoDto['software'])
            : undefined;

        const videos = await getVideos({
            page: Number.isFinite(page) && page > 0 ? page : 1,
            limit: Number.isFinite(limit) && limit > 0 ? limit : 9,
            search,
            sort,
            order,
            type,
            section,
            software,
        });

        res.json(videos);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unexpected videos API error';
        res.status(500).json({ message });
    }
};

export const refreshVideosController = async (_req: JsonServerRequest, res: JsonServerResponse) => {
    try {
        const videos = await refreshRutubeVideosCache();

        res.json({
            success: true,
            count: videos.length,
            updatedAt: Date.now(),
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unexpected videos refresh error';
        res.status(500).json({ success: false, message });
    }
};
