import { rtqApi } from '@/shared/config/api/rtqApi';
import { InstructionArticle, InstructionNavNode } from '../model/types/instruction';

const instructionApi = rtqApi.injectEndpoints({
    endpoints: (build) => ({
        getInstructionTree: build.query<InstructionNavNode[], void>({
            query: () => ({
                url: '/api/instructions/tree',
            }),
        }),
        getInstructionArticle: build.query<InstructionArticle, string>({
            query: (slug) => ({
                url: `/api/instructions/article/${encodeURIComponent(slug)}`,
            }),
        }),
    }),
});

export const {
    useGetInstructionTreeQuery,
    useGetInstructionArticleQuery,
} = instructionApi;
