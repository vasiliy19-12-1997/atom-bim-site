import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { classNames } from '@/shared/lib/classNames/classNames';
import { EIRNavigationSection } from '../lib/types';
import { EIRSidebarTree } from '../EIRSidebarTree/EIRSidebarTree';
import cls from './EIRSidebar.module.scss';

interface EIRSidebarProps {
    className?: string;
    sections: EIRNavigationSection[];
    activeSlug?: string;
    expandedSet: Set<string>;
    mobileOpened?: boolean;
    onCloseMobile?: () => void;
    onToggle: (slug: string) => void;
    onSelect: (slug: string) => void;
}

export const EIRSidebar = memo((props: EIRSidebarProps) => {
    const {
        className,
        sections,
        activeSlug,
        expandedSet,
        mobileOpened = false,
        onCloseMobile,
        onToggle,
        onSelect,
    } = props;
    const { t } = useTranslation();

    return (
        <aside
            id="eir-sidebar"
            className={classNames(cls.EIRSidebar, { [cls.mobileOpened]: mobileOpened }, [className])}
            aria-label={t('Разделы документа')}
        >
            <div className={cls.header}>
                <h2 className={cls.title}>{t('Разделы')}</h2>
                <button
                    type="button"
                    className={cls.close}
                    onClick={onCloseMobile}
                >
                    {t('Закрыть')}
                </button>
            </div>
            {sections.length ? (
                <EIRSidebarTree
                    nodes={sections}
                    activeSlug={activeSlug}
                    expandedSet={expandedSet}
                    onToggle={onToggle}
                    onSelect={onSelect}
                />
            ) : (
                <p className={cls.empty}>{t('Разделы не найдены')}</p>
            )}
        </aside>
    );
});
