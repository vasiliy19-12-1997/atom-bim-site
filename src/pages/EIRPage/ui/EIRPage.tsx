import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetEirDocumentQuery } from '@/entities/EIR';
import { classNames } from '@/shared/lib/classNames/classNames';
import { Page } from '@/shared/ui/deprecated/Page';
import { Sceleton } from '@/shared/ui/Sceleton/Sceleton';
import { EIRBreadcrumbs } from './EIRBreadcrumbs/EIRBreadcrumbs';
import { EIRSectionContent } from './EIRSectionContent/EIRSectionContent';
import { EIRSectionPagination } from './EIRSectionPagination/EIRSectionPagination';
import { EIRSidebar } from './EIRSidebar/EIRSidebar';
import { useEirNavigation } from './lib/useEirNavigation';
import { useEirSections } from './lib/useEirSections';
import cls from './EIRPage.module.scss';

interface EIRPageProps {
    className?: string;
}

const EIRPage = memo((props: EIRPageProps) => {
    const { className } = props;
    const { t } = useTranslation();
    const [mobileSidebarOpened, setMobileSidebarOpened] = useState(false);

    const {
        data: eirDocument,
        isLoading,
        isError,
    } = useGetEirDocumentQuery();

    const {
        preparedHtml,
        tree,
        flatSections,
        sectionsBySlug,
        defaultSectionSlug,
    } = useEirSections(eirDocument);

    const {
        activeSection,
        currentPath,
        expandedSet,
        previousSection,
        nextSection,
        selectSection,
        toggleExpanded,
    } = useEirNavigation({
        tree,
        flatSections,
        sectionsBySlug,
        defaultSectionSlug,
    });

    const handleSelectSection = (slug: string) => {
        selectSection(slug);
        setMobileSidebarOpened(false);
    };

    const currentSectionFragment = activeSection
        ? preparedHtml.slice(activeSection.startIndex, activeSection.endIndex)
        : '';

    return (
        <Page className={classNames(cls.EIRPage, {}, [className])}>
            <div className={cls.mobileSidebarToggleRow}>
                <button
                    type="button"
                    className={cls.mobileSidebarToggle}
                    onClick={() => setMobileSidebarOpened((prev) => !prev)}
                    aria-expanded={mobileSidebarOpened}
                    aria-controls="eir-sidebar"
                >
                    {t('Разделы')}
                </button>
            </div>
            <div className={cls.layout}>
                <EIRSidebar
                    className={cls.sidebar}
                    sections={tree}
                    activeSlug={activeSection?.slug}
                    expandedSet={expandedSet}
                    mobileOpened={mobileSidebarOpened}
                    onCloseMobile={() => setMobileSidebarOpened(false)}
                    onToggle={toggleExpanded}
                    onSelect={handleSelectSection}
                />
                <main className={cls.articleColumn}>
                    {isLoading && (
                        <div className={cls.loadingState}>
                            <Sceleton width="100%" height={28} />
                            <Sceleton width="100%" height={180} />
                            <Sceleton width="100%" height={280} />
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
                    {!isLoading && eirDocument && activeSection && (
                        <div className={cls.contentColumn}>
                            <EIRBreadcrumbs breadcrumbs={eirDocument.breadcrumbs} />
                            <EIRSectionContent
                                section={activeSection}
                                path={currentPath}
                                fragmentHtml={currentSectionFragment}
                                updatedAt={eirDocument.updatedAt}
                            />
                            <EIRSectionPagination
                                previousSection={previousSection}
                                nextSection={nextSection}
                                onSelect={handleSelectSection}
                            />
                        </div>
                    )}
                </main>
            </div>
        </Page>
    );
});

export default EIRPage;
