import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StickyContentLayout } from '@/shared/layouts/StickyContentLayout';
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { Page } from '@/shared/ui/deprecated/Page';
import { fetchNextVideoPage } from '../../model/services/fetchNextVideoPage/fetchNextVideoPage';
import { videoReducer } from '../../model/slices/VideosPageSlice';

const VideosPage = memo(() => {
    const { t } = useTranslation('');
    const dispatch = useAppDispatch();
    const reducers: ReducersList = {
        videosPage: videoReducer,
    };
    const onNextLoad = useCallback(() => {
        dispatch(fetchNextVideoPage());
    }, [dispatch]);

    const content = (
        <StickyContentLayout
            left={<div>left</div>}
            right={<div>right</div>}
            content={
                <Page
                    data-testid="ArticlePageRedesign"
                    onScrollEnd={onNextLoad}
                >
                    {t('VideoPage')}
                    {/* <ArticleInfiniteList className={cls.list} /> */}
                    {/* <ArticlePageGreeting /> */}
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
