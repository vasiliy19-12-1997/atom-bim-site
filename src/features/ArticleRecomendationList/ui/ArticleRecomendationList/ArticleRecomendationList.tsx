import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { ArticleList } from '@/entities/Article';
import { classNames } from '@/shared/lib/classNames/classNames';
import { VStack } from '@/shared/ui/redesigned/Stack';
import { userArticleRecommendationList } from '../../api/articleRecommendationApi';
import { Text } from '@/shared/ui/redesigned/Text';

interface ArticleRecomendationListProps {
    className?: string;
}

export const ArticleRecomendationList = memo((props: ArticleRecomendationListProps) => {
    const { className } = props;
    const { t } = useTranslation();
    const { data: articles, isLoading, error } = userArticleRecommendationList(10);
    if (isLoading || error || !articles) {
        return null;
    }
    return (
        <VStack data-testid="ArticleRecommendationList" gap={8} className={classNames('', {}, [className])}>
            <>
                                    <Text size="l" title={t('Рекомендации')} />
                                    <ArticleList virtualized={false} target="_blank" articles={articles} isLoading={isLoading} />
                                </>
        </VStack>
    );
});
