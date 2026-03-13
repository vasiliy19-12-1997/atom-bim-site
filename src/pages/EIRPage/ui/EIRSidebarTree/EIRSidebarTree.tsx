import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { classNames } from '@/shared/lib/classNames/classNames';
import { EIRNavigationSection } from '../lib/types';
import { EIRSidebarTreeItem } from './EIRSidebarTreeItem';
import cls from './EIRSidebarTree.module.scss';

interface EIRSidebarTreeProps {
    className?: string;
    nodes: EIRNavigationSection[];
    activeSlug?: string;
    expandedSet: Set<string>;
    onToggle: (slug: string) => void;
    onSelect: (slug: string) => void;
}

export const EIRSidebarTree = memo((props: EIRSidebarTreeProps) => {
    const {
        className,
        nodes,
        activeSlug,
        expandedSet,
        onToggle,
        onSelect,
    } = props;
    const { t } = useTranslation();

    return (
        <nav
            className={classNames(cls.EIRSidebarTree, {}, [className])}
            aria-label={t('Оглавление EIR')}
        >
            <ul className={cls.list}>
                {nodes.map((node) => (
                    <EIRSidebarTreeItem
                        key={node.slug}
                        node={node}
                        activeSlug={activeSlug}
                        expandedSet={expandedSet}
                        onToggle={onToggle}
                        onSelect={onSelect}
                    />
                ))}
            </ul>
        </nav>
    );
});
