import { memo } from 'react';
import { useVideoFilters } from '../../lib/hooks/useVideoFilters';
import { VideosFilters } from '../VideosFilters/VideosFilters';

interface FiltersContainerProps {
    className?: string;
}

export const FiltersContainer = memo((props: FiltersContainerProps) => {
    const { className } = props;
    const { sort, order, search, type, onChangeOrder, onChangeSort, onChangeSearch, onChangeVideoType } =
        useVideoFilters();

    return (
        <VideosFilters
            className={className}
            sort={sort}
            order={order}
            search={search}
            type={type}
            onChangeOrder={onChangeOrder}
            onChangeSort={onChangeSort}
            onChangeSearch={onChangeSearch}
            onChangeType={onChangeVideoType}
        />
    );
});
