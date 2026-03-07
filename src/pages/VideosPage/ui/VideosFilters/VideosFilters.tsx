import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { VideoSortField, VideoType } from '@/entities/Video';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { useDebounce } from '@/shared/lib/hooks/useDebounce/useDebounce';
import { Input } from '@/shared/ui/deprecated/Input';
import { Select, SelectOptions } from '@/shared/ui/deprecated/Select';
import { SortOrder } from '@/shared/types/sort';
import {
    getFilterSelectorOrder,
    getFilterSelectorSearch,
    getFilterSelectorSort,
    getVideosPageType,
} from '../../model/selectors/videos';
import { fetchVideos } from '../../model/services/fetchVideos/fetchVideos';
import { videoPageActions } from '../../model/slices/VideosPageSlice';
import cls from './VideosFilters.module.scss';

export const VideosFilters = memo(() => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const search = useSelector(getFilterSelectorSearch);
    const sort = useSelector(getFilterSelectorSort);
    const order = useSelector(getFilterSelectorOrder);
    const type = useSelector(getVideosPageType);
    const typeOptions: SelectOptions<VideoType>[] = useMemo(
        () => [
            { value: VideoType.ALL, content: t('All types') },
            { value: VideoType.VIDEO_INSTRUCTION, content: t('Instructions') },
            { value: VideoType.WEBINARS, content: t('Webinars') },
            { value: VideoType.PLUGINS, content: t('Plugins') },
        ],
        [t],
    );
    const sortOptions: SelectOptions<VideoSortField>[] = useMemo(
        () => [
            { value: VideoSortField.RELEVATION, content: t('By title') },
            { value: VideoSortField.SORT_LEARN, content: t('By publish order') },
        ],
        [t],
    );
    const orderOptions: SelectOptions<SortOrder>[] = useMemo(
        () => [
            { value: 'asc', content: t('Asc') },
            { value: 'desc', content: t('Desc') },
        ],
        [t],
    );

    const refetch = useCallback(() => {
        dispatch(videoPageActions.setPage(1));
        dispatch(fetchVideos({ replace: true }));
    }, [dispatch]);
    const debouncedRefetch = useDebounce(refetch, 500);

    const onChangeSearch = useCallback(
        (value: string) => {
            dispatch(videoPageActions.setSearch(value));
            dispatch(videoPageActions.setPage(1));
            debouncedRefetch();
        },
        [debouncedRefetch, dispatch],
    );

    const onChangeSort = useCallback(
        (value: VideoSortField) => {
            dispatch(videoPageActions.setSort(value));
            refetch();
        },
        [dispatch, refetch],
    );

    const onChangeOrder = useCallback(
        (value: SortOrder) => {
            dispatch(videoPageActions.setOrder(value));
            refetch();
        },
        [dispatch, refetch],
    );

    const onChangeType = useCallback(
        (value: VideoType) => {
            dispatch(videoPageActions.setType(value));
            refetch();
        },
        [dispatch, refetch],
    );

    return (
        <div className={cls.VideosFilters}>
            <Input
                value={search}
                onChange={onChangeSearch}
                placeholder={t('Search by title')}
            />
            <Select
                label={t('Sort')}
                value={sort}
                options={sortOptions}
                onChange={onChangeSort}
            />
            <Select
                label={t('Order')}
                value={order}
                options={orderOptions}
                onChange={onChangeOrder}
            />
            <Select
                label={t('Type')}
                value={type}
                options={typeOptions}
                onChange={onChangeType}
            />
        </div>
    );
});
