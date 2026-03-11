import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EIRSection, EIRTocItem, useGetEirDocumentQuery } from '@/entities/EIR';
import { classNames } from '@/shared/lib/classNames/classNames';
import { PAGE_ID, Page } from '@/shared/ui/deprecated/Page';
import { Sceleton } from '@/shared/ui/Sceleton/Sceleton';
import { EIRBreadcrumbs } from './EIRBreadcrumbs/EIRBreadcrumbs';
import { EIRDocumentView } from './EIRDocumentView/EIRDocumentView';
import { EIRSidebar } from './EIRSidebar/EIRSidebar';
import { EIRToc } from './EIRToc/EIRToc';
import cls from './EIRPage.module.scss';

interface EIRPageProps {
    className?: string;
}

const EIRPage = memo((props: EIRPageProps) => {
    const { className } = props;
    const { t } = useTranslation();

    const [mobileSidebarOpened, setMobileSidebarOpened] = useState(false);
    const [toc, setToc] = useState<EIRTocItem[]>([]);
    const [activeTocId, setActiveTocId] = useState<string | undefined>(undefined);

    const {
        data: eirDocument,
        isLoading,
        isError,
    } = useGetEirDocumentQuery();

    const buildSectionsFromToc = (items: EIRTocItem[]): EIRSection[] => {
        const roots: EIRSection[] = [];
        const stack: EIRSection[] = [];

        items.forEach((item) => {
            const section: EIRSection = {
                id: item.id,
                title: item.title,
                level: item.level,
                html: '',
                children: [],
            };

            while (stack.length && stack[stack.length - 1].level >= section.level) {
                stack.pop();
            }

            const parent = stack[stack.length - 1];
            if (parent) {
                if (!parent.children) {
                    parent.children = [];
                }
                parent.children.push(section);
            } else {
                roots.push(section);
            }

            stack.push(section);
        });

        return roots;
    };

    const sidebarSections = eirDocument?.sections?.length
        ? eirDocument.sections
        : buildSectionsFromToc(toc);

    useEffect(() => {
        setToc(eirDocument?.toc ?? []);
    }, [eirDocument]);

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

    return (
        <Page className={classNames(cls.EIRPage, {}, [className])}>
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
                <EIRSidebar
                    className={cls.sidebar}
                    sections={sidebarSections}
                    activeId={activeTocId}
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
                    {!isLoading && isError && (
                        <div className={cls.emptyState}>
                            {t('Не удалось загрузить EIR документ.')}
                        </div>
                    )}
                    {!isLoading && !isError && !eirDocument && (
                        <div className={cls.emptyState}>
                            {t('EIR документ пуст.')}
                        </div>
                    )}
                    {!isLoading && eirDocument && (
                        <>
                            <EIRBreadcrumbs breadcrumbs={eirDocument.breadcrumbs} />
                            <EIRDocumentView
                                document={eirDocument}
                                onTocResolved={setToc}
                            />
                        </>
                    )}
                </main>
                <EIRToc
                    className={cls.toc}
                    toc={toc}
                    activeId={activeTocId}
                />
            </div>
        </Page>
    );
});

export default EIRPage;
