import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { classNames } from '@/shared/lib/classNames/classNames';
import { Button, ButtonTheme } from '@/shared/ui/Button/Button';
import { EIRNavigationSection } from '../lib/types';
import cls from './EIRSectionPagination.module.scss';

interface EIRSectionPaginationProps {
    className?: string;
    previousSection?: EIRNavigationSection;
    nextSection?: EIRNavigationSection;
    onSelect: (slug: string) => void;
}

export const EIRSectionPagination = memo((props: EIRSectionPaginationProps) => {
    const {
        className,
        previousSection,
        nextSection,
        onSelect,
    } = props;
    const { t } = useTranslation();

    return (
        <nav className={classNames(cls.EIRSectionPagination, {}, [className])} aria-label={t('Навигация по разделам')}>
            <Button
                theme={ButtonTheme.OUTLINE}
                className={cls.button}
                disabled={!previousSection}
                onClick={() => previousSection && onSelect(previousSection.slug)}
            >
                <span className={cls.buttonLabel}>{t('Предыдущий раздел')}</span>
                <span className={cls.buttonTitle}>{previousSection?.title || t('Нет предыдущего раздела')}</span>
            </Button>
            <Button
                theme={ButtonTheme.OUTLINE}
                className={cls.button}
                disabled={!nextSection}
                onClick={() => nextSection && onSelect(nextSection.slug)}
            >
                <span className={cls.buttonLabel}>{t('Следующий раздел')}</span>
                <span className={cls.buttonTitle}>{nextSection?.title || t('Нет следующего раздела')}</span>
            </Button>
        </nav>
    );
});
