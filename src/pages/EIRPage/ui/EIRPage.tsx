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
import { EIRSidebarTree } from './EIRSidebarTree/EIRSidebarTree';
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
        ? activeSection.fragmentHtml || preparedHtml.slice(activeSection.startIndex, activeSection.endIndex)
        : '';
    const sidebarSections = tree.length === 1 && tree[0].isContainer
        ? tree[0].children
        : tree;
    const mobileMenuTitle = activeSection?.title || eirDocument?.title || t('Contents');

    return (
        <Page className={classNames(cls.EIRPage, {}, [className])}>
            <div className={cls.mobileSidebarToggleRow}>
                <button
                    type="button"
                    className={cls.mobileSidebarToggle}
                    onClick={() => setMobileSidebarOpened((prev) => !prev)}
                    aria-expanded={mobileSidebarOpened}
                    aria-controls="eir-mobile-toc"
                >
                    <span className={cls.mobileSidebarToggleLabel}>{t('Contents')}</span>
                    <span className={cls.mobileSidebarToggleValue}>{mobileMenuTitle}</span>
                </button>
                {mobileSidebarOpened && (
                    <div id="eir-mobile-toc" className={cls.mobileSidebarPanel}>
                        {sidebarSections.length ? (
                            <EIRSidebarTree
                                nodes={sidebarSections}
                                activeSlug={activeSection?.slug}
                                expandedSet={expandedSet}
                                onToggle={toggleExpanded}
                                onSelect={handleSelectSection}
                            />
                        ) : (
                            <p className={cls.mobileSidebarEmpty}>{t('No sections found')}</p>
                        )}
                    </div>
                )}
            </div>
            <div className={cls.layout}>
                <EIRSidebar
                    className={cls.sidebar}
                    sections={sidebarSections}
                    activeSlug={activeSection?.slug}
                    expandedSet={expandedSet}
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
                            {t('РќРµ СѓРґР°Р»РѕСЃСЊ Р·Р°РіСЂСѓР·РёС‚СЊ EIR РґРѕРєСѓРјРµРЅС‚.')}
                        </div>
                    )}
                    {!isLoading && !isError && !eirDocument && (
                        <div className={cls.emptyState}>
                            {t('EIR РґРѕРєСѓРјРµРЅС‚ РїСѓСЃС‚.')}
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
