import { HTMLAttributeAnchorTarget, memo } from 'react';
import { Article, ArticleView } from '../../model/types/artcile';
import { ArticleListItemRedesign } from './ArticleListItemRedesign/ArticleListItemRedesign';

export interface ArticleListItemProps {
    className?: string;
    article: Article;
    view: ArticleView;
    target?: HTMLAttributeAnchorTarget;
}

export const ArticleListItem = memo((props: ArticleListItemProps) => {
    return (
        <ArticleListItemRedesign {...props} />
    );
});
