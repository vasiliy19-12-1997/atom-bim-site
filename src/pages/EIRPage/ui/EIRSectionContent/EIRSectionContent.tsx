import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { classNames } from '@/shared/lib/classNames/classNames';
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

    if (!section) {
        return null;
    }

    return (
        <article className={classNames(cls.EIRSectionContent, {}, [className])}>
            <div className={cls.meta}>
                <p className={cls.path}>
                    {path.map((item) => item.title).join(' / ')}
                </p>
                {updatedAt && (
                    <p className={cls.updatedAt}>
                        {t('Обновлено:')} {new Date(updatedAt).toLocaleDateString('ru-RU')}
                    </p>
                )}
            </div>
            <div
                className={cls.content}
                // Rendering only the precomputed HTML fragment for the current section.
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: fragmentHtml }}
            />
        </article>
    );
});
