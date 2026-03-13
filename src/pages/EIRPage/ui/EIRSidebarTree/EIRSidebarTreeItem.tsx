import { KeyboardEvent, MouseEvent, memo } from 'react';
import { useTranslation } from 'react-i18next';
import ChevronDownIcon from '@/shared/assets/icons/new/Chevron Down 24px.svg';
import ChevronRightIcon from '@/shared/assets/icons/new/Chevron Right 24px.svg';
import { classNames } from '@/shared/lib/classNames/classNames';
import { Icon } from '@/shared/ui/Icon/Icon';
import { EIRNavigationSection } from '../lib/types';
import cls from './EIRSidebarTree.module.scss';

interface EIRSidebarTreeItemProps {
    node: EIRNavigationSection;
    activeSlug?: string;
    expandedSet: Set<string>;
    onToggle: (slug: string) => void;
    onSelect: (slug: string) => void;
}

export const EIRSidebarTreeItem = memo((props: EIRSidebarTreeItemProps) => {
    const {
        node,
        activeSlug,
        expandedSet,
        onToggle,
        onSelect,
    } = props;
    const { t } = useTranslation();
    const hasChildren = node.children.length > 0;
    const isExpanded = node.level === 1 || expandedSet.has(node.slug);
    const isContainer = Boolean(node.isContainer);

    const onLinkClick = (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        onSelect(node.slug);
    };

    const onLinkKeyDown = (event: KeyboardEvent<HTMLAnchorElement>) => {
        if ((event.key === 'ArrowRight' || event.key === 'ArrowLeft') && hasChildren) {
            event.preventDefault();

            if (event.key === 'ArrowRight' && !isExpanded) {
                onToggle(node.slug);
            }

            if (event.key === 'ArrowLeft' && isExpanded) {
                onToggle(node.slug);
            }
        }
    };

    return (
        <li className={cls.node}>
            <div className={cls.row}>
                {hasChildren && (
                    <button
                        type="button"
                        className={cls.toggle}
                        onClick={() => {
                            if (node.level > 1) {
                                onToggle(node.slug);
                            }
                        }}
                        aria-expanded={isExpanded}
                        aria-controls={`eir-tree-${node.slug}`}
                        disabled={node.level === 1}
                        aria-label={isExpanded ? t('Свернуть раздел') : t('Раскрыть раздел')}
                    >
                        <Icon
                            Svg={isExpanded ? ChevronDownIcon : ChevronRightIcon}
                            className={cls.toggleIcon}
                        />
                    </button>
                )}
                {!hasChildren && <span className={cls.toggleSpacer} aria-hidden="true" />}
                {isContainer ? (
                    <span
                        className={classNames(cls.link, {
                            [cls.level2]: node.level === 2,
                            [cls.level3]: node.level === 3,
                            [cls.level4]: node.level >= 4,
                            [cls.container]: true,
                        })}
                    >
                        {node.title}
                    </span>
                ) : (
                    <a
                        href={`?section=${node.slug}#${node.slug}`}
                        onClick={onLinkClick}
                        onKeyDown={onLinkKeyDown}
                        className={classNames(cls.link, {
                            [cls.level2]: node.level === 2,
                            [cls.level3]: node.level === 3,
                            [cls.level4]: node.level >= 4,
                            [cls.active]: activeSlug === node.slug,
                        })}
                        aria-current={activeSlug === node.slug ? 'location' : undefined}
                    >
                        {node.title}
                    </a>
                )}
            </div>
            {hasChildren && isExpanded && (
                <ul
                    id={`eir-tree-${node.slug}`}
                    className={classNames(cls.list, {}, [cls.nestedList])}
                >
                    {node.children.map((child) => (
                        <EIRSidebarTreeItem
                            key={child.slug}
                            node={child}
                            activeSlug={activeSlug}
                            expandedSet={expandedSet}
                            onToggle={onToggle}
                            onSelect={onSelect}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
});
