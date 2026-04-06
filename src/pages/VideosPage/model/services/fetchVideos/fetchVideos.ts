import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/shared/config/state';
import { addQueryParams } from '@/shared/lib/url/addQueryParams/addQueryParams';
import { SortOrder } from '@/shared/types/sort';

import { Video, VideoFilterType, VideoSortField, VideoType } from '@/entities/Video';
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
    filter: VideoFilterType | undefined;
};

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
            filter: type === VideoType.ALL ? undefined : type,
        };

        try {
            addQueryParams({
                sort,
                order,
                search,
                type: type === VideoType.ALL ? undefined : type,
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
