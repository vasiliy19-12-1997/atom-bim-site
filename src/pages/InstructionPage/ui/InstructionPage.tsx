import { memo, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    InstructionTocItem,
    useGetInstructionArticleQuery,
    useGetInstructionTreeQuery,
} from '@/entities/Instruction';
import { getRouteInstruction } from '@/shared/const/router';
import { classNames } from '@/shared/lib/classNames/classNames';
import { PAGE_ID, Page } from '@/shared/ui/deprecated/Page';
import { Sceleton } from '@/shared/ui/Sceleton/Sceleton';
import { Text, TextTheme } from '@/shared/ui/Text/Text';
import { InstructionArticleView } from './InstructionArticleView/InstructionArticleView';
import { InstructionBreadcrumbs } from './InstructionBreadcrumbs/InstructionBreadcrumbs';
import { InstructionsSidebar } from './InstructionsSidebar/InstructionsSidebar';
import { InstructionToc } from './InstructionToc/InstructionToc';
import cls from './InstructionPage.module.scss';

interface InstructionPageProps {
    className?: string;
}

interface ApiErrorPayload {
    status?: number;
    data?: {
        message?: string;
    };
}

const getPathParts = (pathname: string) => pathname.split('/').filter(Boolean);

const getSlugFromPath = (pathname: string) => {
    const pathParts = getPathParts(pathname);
    if (pathParts[0] !== 'instruction') {
        return undefined;
    }

    if (pathParts.length === 2) {
        return pathParts[1];
    }

    if (pathParts.length >= 3) {
        return pathParts[2];
    }

    return undefined;
};

const findFirstArticle = (tree: Array<{ children?: Array<{ slug: string }> }>) =>
    tree.map((section) => section.children?.[0]?.slug).find(Boolean);

const findCategoryBySlug = (slug: string, tree: Array<{ slug: string; children?: Array<{ slug: string }> }>) =>
    tree.find((node) => node.children?.some((item) => item.slug === slug))?.slug;

const getErrorText = (error: unknown, fallback: string) => {
    if (!error || typeof error !== 'object') {
        return fallback;
    }

    const payload = error as ApiErrorPayload;
    return payload.data?.message || (payload.status ? `${fallback} (${payload.status})` : fallback);
};

const InstructionPage = memo((props: InstructionPageProps) => {
    const { className } = props;
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();

    const [mobileSidebarOpened, setMobileSidebarOpened] = useState(false);
    const [toc, setToc] = useState<InstructionTocItem[]>([]);
    const [activeTocId, setActiveTocId] = useState<string | undefined>(undefined);

    const routeSlug = useMemo(() => getSlugFromPath(location.pathname), [location.pathname]);

    const {
        data: tree = [],
        isLoading: isTreeLoading,
        error: treeError,
    } = useGetInstructionTreeQuery();
    const firstArticleSlug = useMemo(() => findFirstArticle(tree), [tree]);
    const requestedSlug = routeSlug ?? firstArticleSlug;

    const {
        data: article,
        isLoading: isArticleLoading,
        error: articleError,
    } = useGetInstructionArticleQuery(requestedSlug || '', {
        skip: !requestedSlug,
    });

    useEffect(() => {
        if (!routeSlug && firstArticleSlug) {
            const categorySlug = findCategoryBySlug(firstArticleSlug, tree);
            navigate(getRouteInstruction(firstArticleSlug, categorySlug), { replace: true });
        }
    }, [routeSlug, firstArticleSlug, navigate, tree]);

    useEffect(() => {
        if (!toc.length) {
            return undefined;
        }

        const pageRoot = document.getElementById(PAGE_ID);
        const headings = toc
            .map((item) => document.getElementById(item.id))
            .filter((heading): heading is HTMLElement => Boolean(heading));

        if (!headings.length) {
            return undefined;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

                if (visible?.target?.id) {
                    setActiveTocId(visible.target.id);
                }
            },
            {
                root: pageRoot,
                rootMargin: '0px 0px -70% 0px',
                threshold: [0.2, 0.5, 1],
            },
        );

        headings.forEach((heading) => observer.observe(heading));

        return () => observer.disconnect();
    }, [toc]);

    const isLoading = isTreeLoading || isArticleLoading;
    const errorMessage = getErrorText(treeError || articleError, t('Не удалось загрузить инструкции'));
    const hasError = Boolean(treeError || articleError);
    const isEmpty = !isLoading && !hasError && !tree.length;

    return (
        <Page className={classNames(cls.InstructionPage, {}, [className])}>
            <div className={cls.mobileSidebarToggleRow}>
                <button
                    type="button"
                    className={cls.mobileSidebarToggle}
                    onClick={() => setMobileSidebarOpened((prev) => !prev)}
                >
                    {t('Разделы')}
                </button>
            </div>
            <div className={cls.layout}>
                <InstructionsSidebar
                    className={cls.sidebar}
                    tree={tree}
                    activeSlug={article?.slug || routeSlug}
                    mobileOpened={mobileSidebarOpened}
                    onCloseMobile={() => setMobileSidebarOpened(false)}
                />
                <main className={cls.articleColumn}>
                    {isLoading && (
                        <div className={cls.loadingState}>
                            <Sceleton
                                width="100%"
                                height={28}
                            />
                            <Sceleton
                                width="100%"
                                height={180}
                            />
                            <Sceleton
                                width="100%"
                                height={280}
                            />
                        </div>
                    )}
                    {hasError && (
                        <Text
                            theme={TextTheme.ERROR}
                            title={t('Ошибка загрузки инструкций')}
                            text={errorMessage}
                        />
                    )}
                    {isEmpty && (
                        <Text
                            title={t('Инструкции не найдены')}
                            text={t('В Yandex Wiki пока нет доступных страниц для отображения.')}
                        />
                    )}
                    {!isLoading && !hasError && article && (
                        <>
                            <InstructionBreadcrumbs breadcrumbs={article.breadcrumbs} />
                            <InstructionArticleView
                                article={article}
                                onTocResolved={setToc}
                            />
                        </>
                    )}
                </main>
                <InstructionToc
                    className={cls.toc}
                    toc={toc}
                    activeId={activeTocId}
                />
            </div>
        </Page>
    );
});

export default InstructionPage;
