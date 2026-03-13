import { RefObject, memo, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { EIRDocumentResponse, EIRTocItem } from '@/entities/EIR';
import { classNames } from '@/shared/lib/classNames/classNames';
import { prepareEirHtml } from '../lib/prepareEirHtml';
import cls from './EIRDocumentView.module.scss';

interface EIRDocumentViewProps {
    className?: string;
    document: EIRDocumentResponse;
    onTocResolved?: (toc: EIRTocItem[]) => void;
    contentRef?: RefObject<HTMLDivElement>;
}

export const EIRDocumentView = memo((props: EIRDocumentViewProps) => {
    const {
        className,
        document,
        onTocResolved,
        contentRef,
    } = props;
    const { t } = useTranslation();

    const prepared = useMemo(
        () => prepareEirHtml(document.content, document.toc),
        [document.content, document.toc],
    );

    useEffect(() => {
        onTocResolved?.(prepared.toc);
    }, [onTocResolved, prepared.toc]);

    return (
        <article className={classNames(cls.EIRDocumentView, {}, [className])}>
            <h1 className={cls.title}>{document.title}</h1>
            {document.updatedAt && (
                <p className={cls.updatedAt}>
                    {t('Обновлено:')} {new Date(document.updatedAt).toLocaleDateString('ru-RU')}
                </p>
            )}
            <div
                ref={contentRef}
                className={cls.content}
                // Rendering sanitized HTML from backend document content.
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: prepared.html }}
            />
        </article>
    );
});
