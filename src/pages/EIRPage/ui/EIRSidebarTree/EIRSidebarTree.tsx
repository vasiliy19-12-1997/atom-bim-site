import { MouseEvent, memo, useState } from 'react';
import { EIRSection } from '@/entities/EIR';
import { classNames } from '@/shared/lib/classNames/classNames';
import cls from './EIRSidebarTree.module.scss';

interface EIRSidebarTreeProps {
    className?: string;
    nodes: EIRSection[];
    activeId?: string;
    onSelectItem?: () => void;
}

const scrollToId = (id: string) => {
    const heading = document.getElementById(id);
    if (!heading) {
        return;
    }

    heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

interface TreeNodeProps {
    node: EIRSection;
    activeId?: string;
    onSelectItem?: () => void;
}

const TreeNode = memo((props: TreeNodeProps) => {
    const { node, activeId, onSelectItem } = props;
    const [opened, setOpened] = useState(true);
    const hasChildren = Boolean(node.children?.length);

    const onLinkClick = (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        scrollToId(node.id);
        onSelectItem?.();
    };

    return (
        <li className={cls.node}>
            <div className={cls.row}>
                <a
                    href={`#${node.id}`}
                    onClick={onLinkClick}
                    className={classNames(cls.link, {
                        [cls.level2]: node.level === 2,
                        [cls.level3]: node.level === 3,
                        [cls.active]: activeId === node.id,
                    })}
                >
                    {node.title}
                </a>
                {hasChildren && (
                    <button
                        type="button"
                        className={cls.toggle}
                        onClick={() => setOpened((prev) => !prev)}
                        aria-expanded={opened}
                    >
                        {opened ? '−' : '+'}
                    </button>
                )}
            </div>
            {hasChildren && opened && (
                <ul className={cls.list}>
                    {node.children?.map((child) => (
                        <TreeNode
                            key={child.id}
                            node={child}
                            activeId={activeId}
                            onSelectItem={onSelectItem}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
});

export const EIRSidebarTree = memo((props: EIRSidebarTreeProps) => {
    const {
        className,
        nodes,
        activeId,
        onSelectItem,
    } = props;

    return (
        <div className={classNames(cls.EIRSidebarTree, {}, [className])}>
            <ul className={cls.list}>
                {nodes.map((node) => (
                    <TreeNode
                        key={node.id}
                        node={node}
                        activeId={activeId}
                        onSelectItem={onSelectItem}
                    />
                ))}
            </ul>
        </div>
    );
});
