import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ArticlePageGreeting } from '@/features/articlePageGreeting';
import { StickyContentLayout } from '@/shared/layouts/StickyContentLayout';
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { Page } from '@/shared/ui/deprecated/Page';
import { videoReducer } from '../../model/slices/VideosPageSlice';
import cls from './ArticlePage.module.scss';
import { fetchNextVideoPage } from '../../model/services/fetchNextVideoPage/fetchNextVideoPage';
import { ViewSelectorContainer } from '@/pages/ArticlePage/ui/ViewSelectorContainer/ViewSelectorContainer';
import { FiltersContainer } from '@/pages/ArticlePage/ui/FiltersContainer/FiltersContainer';
import { ArticleInfiniteList } from '@/pages/ArticlePage/ui/ArticleInfiniteList/ArticleInfiniteList';

const ArticlePage = memo(() => {
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
            left={<ViewSelectorContainer />}
            right={<FiltersContainer />}
            content={
                <Page
                    data-testid="ArticlePageRedesign"
                    onScrollEnd={onNextLoad}
                >
                    {t('Article Page')}
                    <ArticleInfiniteList className={cls.list} />
                    <ArticlePageGreeting />
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

export default ArticlePage;
