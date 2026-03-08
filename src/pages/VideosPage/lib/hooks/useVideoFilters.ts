import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { VideoSortField, VideoType } from '@/entities/Video';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { useDebounce } from '@/shared/lib/hooks/useDebounce/useDebounce';
import { SortOrder } from '@/shared/types/sort';
import { fetchVideos } from '../../model/services/fetchVideos/fetchVideos';
import {
    getFilterSelectorOrder,
    getFilterSelectorSearch,
    getFilterSelectorSort,
    getVideosPageType,
} from '../../model/selectors/videos';
import { videoPageActions } from '../../model/slices/VideosPageSlice';

export function useVideoFilters() {
    const dispatch = useAppDispatch();
    const sort = useSelector(getFilterSelectorSort);
    const order = useSelector(getFilterSelectorOrder);
    const search = useSelector(getFilterSelectorSearch);
    const type = useSelector(getVideosPageType);

    const fetchData = useCallback(() => {
        dispatch(fetchVideos({ replace: true }));
    }, [dispatch]);

    const fetchDebounce = useDebounce(fetchData, 500);

    const onChangeOrder = useCallback(
        (newOrder: SortOrder) => {
            dispatch(videoPageActions.setOrder(newOrder));
            dispatch(videoPageActions.setPage(1));
            fetchData();
        },
        [dispatch, fetchData],
    );

    const onChangeSort = useCallback(
        (newSort: VideoSortField) => {
            dispatch(videoPageActions.setSort(newSort));
            dispatch(videoPageActions.setPage(1));
            fetchData();
        },
        [dispatch, fetchData],
    );

    const onChangeSearch = useCallback(
        (newSearch: string) => {
            dispatch(videoPageActions.setSearch(newSearch));
            dispatch(videoPageActions.setPage(1));
            fetchDebounce();
        },
        [dispatch, fetchDebounce],
    );

    const onChangeVideoType = useCallback(
        (newType: VideoType) => {
            dispatch(videoPageActions.setType(newType));
            dispatch(videoPageActions.setPage(1));
            fetchData();
        },
        [dispatch, fetchData],
    );

    return {
        sort,
        order,
        search,
        type,
        onChangeOrder,
        onChangeSort,
        onChangeSearch,
        onChangeVideoType,
    };
}
