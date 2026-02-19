import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { classNames } from '@/shared/lib/classNames/classNames';
import ListIcon from '@/shared/assets/icons/burger.svg';
import TiledIcon from '@/shared/assets/icons/tile.svg';
import { ArticleViews } from '@/entities/Article';
import cls from './ArticleViewSelector.module.scss';
import { Icon } from '@/shared/ui/redesigned/Icon';
import { Card } from '@/shared/ui/redesigned/Card';
import { HStack } from '@/shared/ui/redesigned/Stack';

interface ArticleViewSelectorProps {
    className?: string;
    view: ArticleViews | undefined;
    onViewClick: (view: ArticleViews) => void;
}

export const ArticleViewSelector = memo((props: ArticleViewSelectorProps) => {
    const { t } = useTranslation();

    const { className, view, onViewClick } = props;
    const viewTypes = [
        {
            view: ArticleViews.SMALL,
            icon: ListIcon,
        },
        {
            view: ArticleViews.BIG,
            icon: TiledIcon,
        },
    ];

    const onClick = (newView: ArticleViews) => () => {
        onViewClick?.(newView);
    };

    return (
        <Card border="round" className={classNames(cls.ArticleViewSelectorRedesign, {}, [className])}>
                            <HStack gap={8}>
                                {viewTypes.map((item, index) => (
                                    <Icon
                                        key={item.view}
                                        onClick={onClick(item.view)}
                                        clickable
                                        Svg={item.icon}
                                        className={classNames('', { [cls.notSelected]: item.view !== view })}
                                    />
                                ))}
                            </HStack>
                        </Card>
    );
});
