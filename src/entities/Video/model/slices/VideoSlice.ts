import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VideoSchema } from '../types/video';

const initialState: VideoSchema = {};

export const VideoSlice = createSlice({
    name: 'Video',
    initialState,
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

export const { actions: VideoActions } = VideoSlice;
export const { reducer: VideoReducer } = VideoSlice;
