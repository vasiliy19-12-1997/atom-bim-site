import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StickyContentLayout } from '@/shared/layouts/StickyContentLayout';
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { Page } from '@/shared/ui/deprecated/Page';
import { Text, TextSize } from '@/shared/ui/deprecated/Text';
import { videoReducer } from '../../model/slices/VideosPageSlice';
import cls from './VideosPage.module.scss';
import { fetchNextVideoPage } from '../../model/services/fetchNextVideoPage/fetchNextVideoPage';
import { VideosInfiniteList } from '../VideosInfiniteList/VideosInfiniteList';
import { VideosFilters } from '../VideosFilters/VideosFilters';

const VideosPage = memo(() => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const reducers: ReducersList = {
        videosPage: videoReducer,
    };
    const onNextLoad = useCallback(() => {
        dispatch(fetchNextVideoPage());
    }, [dispatch]);

    const content = (
        <StickyContentLayout
            left={<VideosFilters />}
            content={
                <Page
                    data-testid="VideosPage"
                    onScrollEnd={onNextLoad}
                >
                    <Text
                        title={t('Videos')}
                        text={t('Learning materials, webinars and plugin overviews')}
                        size={TextSize.L}
                    />
                    <VideosInfiniteList className={cls.list} />
                </Page>
            }
        />
    );

    return (
        <DynamicModuleLoader
            reducers={reducers}
            removeAfterUnmount={false}
        >
            {content}
        </DynamicModuleLoader>
    );
});

export default VideosPage;
