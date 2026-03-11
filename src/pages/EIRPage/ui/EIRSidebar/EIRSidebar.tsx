import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { EIRSection } from '@/entities/EIR';
import { classNames } from '@/shared/lib/classNames/classNames';
import { EIRSidebarTree } from '../EIRSidebarTree/EIRSidebarTree';
import cls from './EIRSidebar.module.scss';

interface EIRSidebarProps {
    className?: string;
    sections: EIRSection[];
    activeId?: string;
    mobileOpened?: boolean;
    onCloseMobile?: () => void;
}

export const EIRSidebar = memo((props: EIRSidebarProps) => {
    const {
        className,
        sections,
        activeId,
        mobileOpened = false,
        onCloseMobile,
    } = props;
    const { t } = useTranslation();

    return (
        <aside className={classNames(cls.EIRSidebar, { [cls.mobileOpened]: mobileOpened }, [className])}>
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
            <EIRSidebarTree
                nodes={sections}
                activeId={activeId}
                onSelectItem={onCloseMobile}
            />
        </aside>
    );
});
