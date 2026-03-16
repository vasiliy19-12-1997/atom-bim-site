import { memo, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { classNames } from '@/shared/lib/classNames/classNames';
import { Button, ButtonTheme } from '@/shared/ui/Button/Button';
import { paginateEirHtml } from '../lib/paginateEirHtml';
import { EIRNavigationSection } from '../lib/types';
import cls from './EIRSectionContent.module.scss';

interface EIRSectionContentProps {
    className?: string;
    section?: EIRNavigationSection;
    path: EIRNavigationSection[];
    fragmentHtml: string;
    updatedAt?: string;
}

export const EIRSectionContent = memo((props: EIRSectionContentProps) => {
    const {
        className,
        section,
        path,
        fragmentHtml,
        updatedAt,
    } = props;
    const { t } = useTranslation();

    const pages = useMemo(() => paginateEirHtml(fragmentHtml), [fragmentHtml]);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        setCurrentPage(0);
    }, [fragmentHtml]);

    if (!section) {
        return null;
    }

    const pageIndex = Math.min(currentPage, Math.max(pages.length - 1, 0));
    const pageHtml = pages[pageIndex] || fragmentHtml;

    return (
        <article className={classNames(cls.EIRSectionContent, {}, [className])}>
            <div className={cls.meta}>
                <p className={cls.path}>
                    {path.map((item) => item.title).join(' / ')}
                </p>
                {updatedAt && (
                    <p className={cls.updatedAt}>
                        {t('Updated:')} {new Date(updatedAt).toLocaleDateString('ru-RU')}
                    </p>
                )}
            </div>
            <div
                className={cls.content}
                // Rendering only the precomputed HTML fragment for the current section.
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: pageHtml }}
            />
            {pages.length > 1 && (
                <nav className={cls.pageNavigation} aria-label={t('Section pages')}>
                    <Button
                        theme={ButtonTheme.OUTLINE}
                        disabled={pageIndex === 0}
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                    >
                        {'<'}
                    </Button>
                    <span className={cls.pageIndicator}>
                        {pageIndex + 1} / {pages.length}
                    </span>
                    <Button
                        theme={ButtonTheme.OUTLINE}
                        disabled={pageIndex === pages.length - 1}
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pages.length - 1))}
                    >
                        {'>'}
                    </Button>
                </nav>
            )}
        </article>
    );
});
