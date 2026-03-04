import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VideosPageSchema } from '../types/VideosPageSchema';

const videosAdapter = createEntityAdapter<>

export const VideosPageSlice = createSlice({
    name: 'VideosPageSlice',
    initialState:,
    reducers: {
        template: (state, action: PayloadAction<string>) => {},
    },
    // extraReducers: (builder) => {
    //     builder
    //         .addCase(, (state) => {
    //             state.error = undefined;
    //             state.isLoading = true;
    //         })
    //         .addCase(, (state) => {
    //             state.isLoading = false;
    //         })
    //         .addCase(, (state, action) => {
    //             state.isLoading = false;
    //             state.error = action.payload;
    //         });
    // },
});

export const { actions: VideosPageActions } = VideosPageSlice;
export const { reducer: VideosPageReducer } = VideosPageSlice;
