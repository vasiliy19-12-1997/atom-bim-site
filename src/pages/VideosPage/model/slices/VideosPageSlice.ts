import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VideosPageSchema } from '../types/VideosPageSchema';

const initialState: VideosPageSchema = {
    
};

export const VideosPageSlice = createSlice({
    name: 'VideosPage',
    initialState,
    reducers: {
        template: (state, action: PayloadAction<string>) => {
           
        },
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