import { memo, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { InstructionArticle, InstructionTocItem } from '@/entities/Instruction';
import { classNames } from '@/shared/lib/classNames/classNames';
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

    const prepared = useMemo(() => prepareInstructionHtml(article.content, article.toc), [article.content, article.toc]);

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
            <div
                className={cls.content}
                // Rendering sanitized HTML from backend article content.
                dangerouslySetInnerHTML={{ __html: prepared.html }}
            />
        </article>
    );
});
