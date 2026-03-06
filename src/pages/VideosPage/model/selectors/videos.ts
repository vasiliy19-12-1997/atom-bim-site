import { StateSchema } from '@/app/providers/StoreProvider';
import { VideoSortField, VideoType } from '@/entities/Video';
import { buildSelector } from '@/shared/lib/store';

export const getVideosError = (state: StateSchema) => state.videosPage?.error || undefined;
export const getVideosIsLoading = (state: StateSchema) => state.videosPage?.isLoading || false;
export const getVideosViews = (state: StateSchema) => state.videosPage?.view || undefined;
export const getVideosPageNumber = (state: StateSchema) => state.videosPage?.page || 1;
export const getVideosPageLimit = (state: StateSchema) => state.videosPage?.limit || 9;
export const getVideosPageHasMore = (state: StateSchema) => state.videosPage?.hasMore || false;
export const getVideosPageInited = (state: StateSchema) => state.videosPage?._inited || false;
export const getFilterSelectorSort = (state: StateSchema) => state.videosPage?.sort ?? VideoSortField.RELEVATION;
export const getFilterSelectorOrder = (state: StateSchema) => state.videosPage?.order ?? 'asc';
export const getFilterSelectorSearch = (state: StateSchema) => state.videosPage?.search ?? '';
export const getVideosPageType = (state: StateSchema) => state.videosPage?.type ?? VideoType.ALL;

export const [useVideoItemById] = buildSelector((state: StateSchema, id: string) => state.videosPage?.entities[id]);
