import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StateSchema } from '@/app/providers/StoreProvider';
import { Video, VideoSortField, VideoType } from '@/entities/Video';
import { VIDEO_VIEWS_LOCALSTORAGE_KEY } from '@/shared/const/localstorage';
import { View } from '@/shared/types';
import { SortOrder } from '@/shared/types/sort';
import { VideosPageSchema } from '../types/VideosPageSchema';
import { fetchVideos } from '../services/fetchVideos/fetchVideos';

// Since we don't provide `selectId`, it defaults to assuming `entity.id` is the right field
const videosAdapter = createEntityAdapter<Video>({
    selectId: (video) => video.id,
});
export const getVideos = videosAdapter.getSelectors<StateSchema>(
    (state) => state.videosPage || videosAdapter.getInitialState(),
);
const VideosPageSlice = createSlice({
    name: 'VideosPageSlice',
    initialState: videosAdapter.getInitialState<VideosPageSchema>({
        isLoading: false,
        error: undefined,
        view: View.SMALL,
        page: 1,
        hasMore: true,
        _inited: false,
        limit: 9,
        order: 'asc',
        search: '',
        sort: VideoSortField.RELEVATION,
        type: VideoType.ALL,
    }),
    reducers: {
        setView: (state, action: PayloadAction<View>) => {
            state.view = action.payload;
            localStorage.setItem(VIDEO_VIEWS_LOCALSTORAGE_KEY, action.payload);
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
        setOrder: (state, action: PayloadAction<SortOrder>) => {
            state.order = action.payload;
        },
        setSort: (state, action: PayloadAction<VideoSortField>) => {
            state.sort = action.payload;
        },
        setSearch: (state, action: PayloadAction<string>) => {
            state.search = action.payload;
        },
        setType: (state, action: PayloadAction<VideoType>) => {
            state.type = action.payload;
        },
        initState: (state) => {
            const view = localStorage.getItem(VIDEO_VIEWS_LOCALSTORAGE_KEY) as View;
            if (view) {
                state.view = view;
            }
            state.limit = view === View.BIG ? 4 : 9;
            state._inited = true;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchVideos.pending, (state, action) => {
                state.error = undefined;
                state.isLoading = true;
                if (action.meta.arg.replace) {
                    videosAdapter.removeAll(state);
                }
            })
            .addCase(fetchVideos.fulfilled, (state, action) => {
                state.isLoading = false;
                state.hasMore = action.payload.length >= state.limit;
                if (action.meta.arg.replace) {
                    videosAdapter.setAll(state, action.payload);
                } else {
                    videosAdapter.addMany(state, action.payload);
                }
            })
            .addCase(fetchVideos.rejected, (state, action) => {
                state.isLoading = false;
                if (typeof action.payload === 'string' || action.payload === undefined) {
                    state.error = action.payload;
                }
            });
    },
});
export const { reducer: videoReducer, actions: videoPageActions } = VideosPageSlice;
