import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { VideoSortField } from '@/entities/Video';
import { classNames } from '@/shared/lib/classNames/classNames';
import { SortOrder } from '@/shared/types/sort';
import { ListBox, ListBoxItem } from '@/shared/ui/redesigned/Popups/ui/ListBox/ListBox';
import { VStack } from '@/shared/ui/redesigned/Stack';
import { Text } from '@/shared/ui/redesigned/Text';
import cls from './VideoSortSelector.module.scss';

interface VideoSortSelectorProps {
    className?: string;
    sort: VideoSortField;
    order: SortOrder;
    onChangeOrder: (newOrder: SortOrder) => void;
    onChangeSort: (newSort: VideoSortField) => void;
}

export const VideoSortSelector = memo((props: VideoSortSelectorProps) => {
    const { className, sort, order, onChangeOrder, onChangeSort } = props;
    const { t } = useTranslation();

    const sortOptions = useMemo<ListBoxItem<VideoSortField>[]>(
        () => [
            { value: VideoSortField.RELEVATION, content: t('By title') },
            { value: VideoSortField.SORT_LEARN, content: t('By publish order') },
        ],
        [t],
    );

    const orderOptions = useMemo<ListBoxItem<SortOrder>[]>(
        () => [
            { value: 'asc', content: t('Asc') },
            { value: 'desc', content: t('Desc') },
        ],
        [t],
    );

    return (
        <div className={classNames(cls.VideoSortSelector, {}, [className])}>
            <VStack gap={8}>
                <Text text={t('Sort by')} />
                <ListBox
                    value={sort}
                    onChange={onChangeSort}
                    items={sortOptions}
                />
                <ListBox
                    value={order}
                    onChange={onChangeOrder}
                    items={orderOptions}
                />
            </VStack>
        </div>
    );
});
