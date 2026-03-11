import { rtqApi } from '@/shared/config/api/rtqApi';
import { EIRDocumentResponse, EIRTocItem } from '../model/types/eir';

const eirApi = rtqApi.injectEndpoints({
    endpoints: (build) => ({
        getEirDocument: build.query<EIRDocumentResponse, void>({
            query: () => ({
                url: '/api/eir/document',
            }),
        }),
        getEirToc: build.query<EIRTocItem[], void>({
            query: () => ({
                url: '/api/eir/toc',
            }),
        }),
    }),
});

export const {
    useGetEirDocumentQuery,
    useGetEirTocQuery,
} = eirApi;
