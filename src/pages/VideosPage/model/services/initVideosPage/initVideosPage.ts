import { createAsyncThunk } from '@reduxjs/toolkit';
import { VideoSortField, VideoType } from '@/entities/Video';
import { ThunkConfig } from '@/shared/config/state';
import { SortOrder } from '@/shared/types/sort';
import { getVideosPageInited } from '../../selectors/videos';
import { videoPageActions } from '../../slices/VideosPageSlice';
import { fetchVideos } from '../fetchVideos/fetchVideos';

export const initVideosPage = createAsyncThunk<void, URLSearchParams, ThunkConfig<string>>(
    'videosPage/initVideosPage',
    async (searchParams, thunkApi) => {
        const { getState, dispatch } = thunkApi;
        const inited = getVideosPageInited(getState());

        const orderFromUrl = searchParams.get('order') as SortOrder;
        const sortFromUrl = searchParams.get('sort') as VideoSortField;
        const searchFromUrl = searchParams.get('search');
        const typeFromUrl = searchParams.get('type') as VideoType;

        if (orderFromUrl) {
            dispatch(videoPageActions.setOrder(orderFromUrl));
        }
        if (sortFromUrl) {
            dispatch(videoPageActions.setSort(sortFromUrl));
        }
        if (searchFromUrl) {
            dispatch(videoPageActions.setSearch(searchFromUrl));
        }
        if (typeFromUrl) {
            dispatch(videoPageActions.setType(typeFromUrl));
        }

        if (!inited) {
            dispatch(videoPageActions.initState());
            dispatch(fetchVideos({ replace: true }));
        }
    },
);
