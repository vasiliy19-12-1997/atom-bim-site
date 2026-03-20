import { memo, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { InstructionArticle, InstructionTocItem } from '@/entities/Instruction';
import { getRouteInstruction } from '@/shared/const/router';
import { classNames } from '@/shared/lib/classNames/classNames';
import { AppLink } from '@/shared/ui/AppLink/AppLink';
import { prepareInstructionHtml } from '../lib/prepareInstructionHtml';
import cls from './InstructionArticleView.module.scss';

interface InstructionArticleViewProps {
    className?: string;
    article: InstructionArticle;
    onTocResolved?: (toc: InstructionTocItem[]) => void;
}

export const InstructionArticleView = memo((props: InstructionArticleViewProps) => {
    const { className, article, onTocResolved } = props;
    const { t } = useTranslation();

    const prepared = useMemo(() => prepareInstructionHtml(article), [article]);

    useEffect(() => {
        onTocResolved?.(prepared.toc);
    }, [onTocResolved, prepared.toc]);

    return (
        <article className={classNames(cls.InstructionArticleView, {}, [className])}>
            <h1 className={cls.title}>{article.title}</h1>
            {article.updatedAt && (
                <p className={cls.updatedAt}>
                    {t('Обновлено:')}{' '}
                    {new Date(article.updatedAt).toLocaleDateString('ru-RU')}
                </p>
            )}
            {article.kind === 'section' && (
                <section className={cls.sectionItems}>
                    <h2 className={cls.sectionItemsTitle}>{t('Инструкции раздела')}</h2>
                    {article.items.length ? (
                        <ul className={cls.sectionItemsList}>
                            {article.items.map((item) => (
                                <li key={item.id}>
                                    <AppLink
                                        className={cls.sectionItemLink}
                                        to={getRouteInstruction(item.slug, article.slug)}
                                    >
                                        {item.title}
                                    </AppLink>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className={cls.sectionItemsEmpty}>
                            {t('В этом разделе пока нет доступных инструкций.')}
                        </p>
                    )}
                </section>
            )}
            {prepared.html && (
                <div
                    className={cls.content}
                    // Rendering sanitized HTML from backend article content.
                    dangerouslySetInnerHTML={{ __html: prepared.html }}
                />
            )}
        </article>
    );
});
