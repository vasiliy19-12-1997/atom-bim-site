import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TestsPageSchema } from '../types/TestsPageSchema';

const initialState: TestsPageSchema = {
    
};

export const TestsPageSlice = createSlice({
    name: 'TestsPage',
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

export const { actions: TestsPageActions } = TestsPageSlice;
export const { reducer: TestsPageReducer } = TestsPageSlice;