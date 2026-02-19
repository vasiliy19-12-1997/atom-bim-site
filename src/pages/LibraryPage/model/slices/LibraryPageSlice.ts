import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LibraryPageSchema } from '../types/LibraryPageSchema';

const initialState: LibraryPageSchema = {
    
};

export const LibraryPageSlice = createSlice({
    name: 'LibraryPage',
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

export const { actions: LibraryPageActions } = LibraryPageSlice;
export const { reducer: LibraryPageReducer } = LibraryPageSlice;