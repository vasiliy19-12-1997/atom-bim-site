import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { VideoSortField, VideoFilterType } from '@/entities/Video';
import SearchIcon from '@/shared/assets/icons/old/search.svg';
import { classNames } from '@/shared/lib/classNames/classNames';
import { SortOrder } from '@/shared/types/sort';
import { Card } from '@/shared/ui/redesigned/Card';
import { Icon } from '@/shared/ui/redesigned/Icon';
import { Input } from '@/shared/ui/redesigned/Input';
import { VStack } from '@/shared/ui/redesigned/Stack';
import { VideoPageTabs } from '../VideoPageTabs/VideoPageTabs';
import cls from './VideosFilters.module.scss';

interface VideosFiltersProps {
    className?: string;
    sort: VideoSortField;
    order: SortOrder;
    type: VideoFilterType;
    search: string;
    onChangeSort: (newSort: VideoSortField) => void;
    onChangeOrder: (newOrder: SortOrder) => void;
    onChangeFilter: (newType: VideoFilterType) => void;
    onChangeSearch: (value: string) => void;
}

export const VideosFilters = memo((props: VideosFiltersProps) => {
    const { t } = useTranslation();
    const { className, sort, order, type, search, onChangeSort, onChangeOrder, onChangeFilter, onChangeSearch } = props;

    return (
        <Card
            className={classNames(cls.VideosFilters, {}, [className])}
            padding="24"
        >
            <VStack gap={32}>
                <Input
                    size="s"
                    addonLeft={<Icon Svg={SearchIcon} />}
                    placeholder={t('Search by title')}
                    value={search}
                    onChange={onChangeSearch}
                />
                <VideoPageTabs
                    className={cls.tabs}
                    value={type}
                    onChangeType={onChangeFilter}
                />
                {/* <VideoSortSelector
                    sort={sort}
                    order={order}
                    onChangeSort={onChangeSort}
                    onChangeOrder={onChangeOrder}
                /> */}
            </VStack>
        </Card>
    );
});
