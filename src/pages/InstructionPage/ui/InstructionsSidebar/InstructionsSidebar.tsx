import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { InstructionNavNode } from '@/entities/Instruction';
import { classNames } from '@/shared/lib/classNames/classNames';
import { InstructionsSidebarTree } from '../InstructionsSidebarTree/InstructionsSidebarTree';
import cls from './InstructionsSidebar.module.scss';

interface InstructionsSidebarProps {
    className?: string;
    tree: InstructionNavNode[];
    activeSlug?: string;
    mobileOpened?: boolean;
    onCloseMobile?: () => void;
}

export const InstructionsSidebar = memo((props: InstructionsSidebarProps) => {
    const {
        className,
        tree,
        activeSlug,
        mobileOpened = false,
        onCloseMobile,
    } = props;
    const { t } = useTranslation();

    return (
        <aside className={classNames(cls.InstructionsSidebar, { [cls.mobileOpened]: mobileOpened }, [className])}>
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
            <InstructionsSidebarTree
                nodes={tree}
                activeSlug={activeSlug}
                onSelectArticle={onCloseMobile}
            />
        </aside>
    );
});
