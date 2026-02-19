import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ArticlePageGreeting } from '@/features/articlePageGreeting';
import { StickyContentLayout } from '@/shared/layouts/StickyContentLayout';
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { Page } from '@/shared/ui/deprecated/Page';
import { fetchNextArticlePage } from '../../model/services/fetchNextArticlePage/fetchNextArticlePage';
import { articlesReducer } from '../../model/slice/articlePageSlice';
import { ArticleInfiniteList } from '../ArticleInfiniteList/ArticleInfiniteList';
import { ViewSelectorContainer } from '../ViewSelectorContainer/ViewSelectorContainer';
import cls from './ArticlePage.module.scss';
import { FiltersContainer } from '../FiltersContainer/FiltersContainer';

const ArticlePage = memo(() => {
    const { t } = useTranslation('');
    const dispatch = useAppDispatch();
    const reducers: ReducersList = {
        articlePage: articlesReducer,
    };

    const onNextLoad = useCallback(() => {
        dispatch(fetchNextArticlePage());
    }, [dispatch]);

    const content = (
        <StickyContentLayout
                            left={<ViewSelectorContainer />}
                            right={<FiltersContainer />}
                            content={
                                <Page data-testid="ArticlePageRedesign" onScrollEnd={onNextLoad}>
                                    {t('Article Page')}
                                    <ArticleInfiniteList className={cls.list} />
                                    <ArticlePageGreeting />
                                </Page>
                            }
                        />
    );

    return (
        <DynamicModuleLoader reducers={reducers} removeAfterUnmount={false}>
            {content}
        </DynamicModuleLoader>
    );
});

export default ArticlePage;
