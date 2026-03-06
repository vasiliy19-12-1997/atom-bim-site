import { createAsyncThunk } from '@reduxjs/toolkit';
import { Article } from '@/entities/Article';
import { ThunkConfig } from '@/shared/config/state';
import { addQueryParams } from '@/shared/lib/url/addQueryParams/addQueryParams';
import { SortOrder } from '@/shared/types/sort';

import { Video, VideoSortField, VideoType } from '@/entities/Video';
import {
    getFilterSelectorOrder,
    getFilterSelectorSearch,
    getFilterSelectorSort,
    getVideosPageLimit,
    getVideosPageNumber,
    getVideosPageType,
} from '../../selectors/videos';

interface fetchVideosProps {
    replace?: boolean;
}
type VideosQuery = {
    _expand?: 'user';
    _page?: number;
    _limit?: number;
    _sort: VideoSortField;
    _order: SortOrder;
    q: string;
    type: VideoType | undefined;
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
        const type = getVideosPageType(getState());

        const params: VideosQuery = {
            _expand: 'user',
            _page: page,
            _limit: limit,
            _sort: sort,
            _order: order,
            q: search,
            type: type === VideoType.ALL ? undefined : type,
        };

        try {
            addQueryParams({
                sort,
                order,
                search,
                type,
            });
            const response = await extra.api.get<Article[]>('/videos', {
                params,
            });
            if (!response) {
                throw new Error();
            }
            return response.data;
        } catch (error) {
            return rejectWithValue(error as string);
        }
    },
);
