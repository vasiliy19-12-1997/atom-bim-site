import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/shared/config/state';
import { addQueryParams } from '@/shared/lib/url/addQueryParams/addQueryParams';
import { SortOrder } from '@/shared/types/sort';

import { Video, VideoFilterType, VideoMainSections, VideoSoftware, VideoSortField, VideoType } from '@/entities/Video';
import {
    getFilterSelectorOrder,
    getFilterSelectorSearch,
    getFilterSelectorSort,
    getVideosPageLimit,
    getVideosPageNumber,
    getVideosFilters,
} from '../../selectors/videos';

interface fetchVideosProps {
    replace?: boolean;
}
type VideosQuery = {
    _page?: number;
    _limit?: number;
    _sort: VideoSortField;
    _order: SortOrder;
    q: string;
    type?: VideoType;
    section?: VideoMainSections;
    software?: VideoSoftware;
};

const TYPE_VALUES: VideoType[] = [VideoType.VIDEO_INSTRUCTION, VideoType.WEBINARS, VideoType.PLUGINS];
const SECTION_VALUES: VideoMainSections[] = [
    VideoMainSections.COMMON,
    VideoMainSections.AR,
    VideoMainSections.KR,
    VideoMainSections.OV,
    VideoMainSections.VK,
    VideoMainSections.EL,
];
const SOFTWARE_VALUES: VideoSoftware[] = [
    VideoSoftware.AUTOCAD,
    VideoSoftware.REVIT,
    VideoSoftware.TANGL_VALUE,
    VideoSoftware.CIVIL3D,
];

const isVideoType = (value: VideoFilterType): value is VideoType => TYPE_VALUES.includes(value as VideoType);
const isVideoSection = (value: VideoFilterType): value is VideoMainSections =>
    SECTION_VALUES.includes(value as VideoMainSections);
const isVideoSoftware = (value: VideoFilterType): value is VideoSoftware =>
    SOFTWARE_VALUES.includes(value as VideoSoftware);

export const fetchVideos = createAsyncThunk<Video[], fetchVideosProps, ThunkConfig<string>>(
    'VideosPage/fetchVideos',
    async (props, thunkApi) => {
        const { extra, rejectWithValue, getState } = thunkApi;

        const limit = getVideosPageLimit(getState());
        const sort = getFilterSelectorSort(getState());
        const order = getFilterSelectorOrder(getState());
        const search = getFilterSelectorSearch(getState());
        const page = getVideosPageNumber(getState());
        const type = getVideosFilters(getState());

        const params: VideosQuery = {
            _page: page,
            _limit: limit,
            _sort: sort,
            _order: order,
            q: search,
        };

        if (type !== VideoType.ALL) {
            if (isVideoType(type)) {
                params.type = type;
            } else if (isVideoSection(type)) {
                params.section = type;
            } else if (isVideoSoftware(type)) {
                params.software = type;
            }
        }

        try {
            addQueryParams({
                sort,
                order,
                search,
                type: params.type,
                section: params.section,
                software: params.software,
            });
            const response = await extra.api.get<Video[]>('/api/videos/rutube', {
                params,
            });
            if (!response.data) {
                throw new Error();
            }
            return response.data;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch videos';
            return rejectWithValue(errorMessage);
        }
    },
);
