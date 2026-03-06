import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/shared/config/state';
import { getVideosIsLoading, getVideosPageHasMore, getVideosPageNumber } from '../../selectors/videos';
import { videoPageActions } from '../../slices/VideosPageSlice';
import { fetchVideos } from '../fetchVideos/fetchVideos';

export const fetchNextVideoPage = createAsyncThunk<void, void, ThunkConfig<string>>(
    'videosPage/fetchNextVideosPage',
    async (_, thunkApi) => {
        const { getState, dispatch } = thunkApi;
        const hasMore = getVideosPageHasMore(getState());
        const isLoading = getVideosIsLoading(getState());
        const page = getVideosPageNumber(getState());

        if (hasMore && !isLoading) {
            dispatch(videoPageActions.setPage(page + 1));
            dispatch(fetchVideos({}));
        }
    },
);
