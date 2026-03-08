import { memo, useMemo, useState } from 'react';
import { InstructionNavNode } from '@/entities/Instruction';
import { getRouteInstruction } from '@/shared/const/router';
import { classNames } from '@/shared/lib/classNames/classNames';
import { AppLink } from '@/shared/ui/AppLink/AppLink';
import cls from './InstructionsSidebarTree.module.scss';

interface InstructionsSidebarTreeProps {
    className?: string;
    nodes: InstructionNavNode[];
    activeSlug?: string;
    onSelectArticle?: () => void;
}

const buildCategoryIndex = (tree: InstructionNavNode[]): Map<string, string> => {
    const map = new Map<string, string>();

    tree.forEach((category) => {
        category.children?.forEach((article) => {
            map.set(article.slug, category.slug);
        });
    });

    return map;
};

export const InstructionsSidebarTree = memo((props: InstructionsSidebarTreeProps) => {
    const { className, nodes, activeSlug, onSelectArticle } = props;
    const [opened, setOpened] = useState<Record<string, boolean>>({});

    const categoryByArticleSlug = useMemo(() => buildCategoryIndex(nodes), [nodes]);

    const toggleCategory = (id: string) => {
        setOpened((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return (
        <div className={classNames(cls.InstructionsSidebarTree, {}, [className])}>
            {nodes.map((node) => {
                const hasChildren = Boolean(node.children?.length);
                const isOpened = opened[node.id] ?? true;

                return (
                    <section
                        key={node.id}
                        className={cls.group}
                    >
                        <button
                            type="button"
                            onClick={() => toggleCategory(node.id)}
                            className={cls.groupButton}
                            aria-expanded={isOpened}
                        >
                            <span>{node.title}</span>
                            {hasChildren && <span className={cls.chevron}>{isOpened ? '−' : '+'}</span>}
                        </button>
                        {hasChildren && isOpened && (
                            <ul className={cls.list}>
                                {node.children?.map((article) => {
                                    const articleCategory = categoryByArticleSlug.get(article.slug);

                                    return (
                                        <li key={article.id}>
                                            <AppLink
                                                className={classNames(cls.link, {
                                                    [cls.active]: activeSlug === article.slug,
                                                })}
                                                to={getRouteInstruction(article.slug, articleCategory)}
                                                onClick={onSelectArticle}
                                            >
                                                {article.title}
                                            </AppLink>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </section>
                );
            })}
        </div>
    );
});
