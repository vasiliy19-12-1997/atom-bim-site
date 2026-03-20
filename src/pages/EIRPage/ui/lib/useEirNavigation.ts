import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PAGE_ID } from '@/shared/ui/deprecated/Page';
import { EIRNavigationSection } from './types';

interface UseEirNavigationParams {
    tree: EIRNavigationSection[];
    flatSections: EIRNavigationSection[];
    sectionsBySlug: Record<string, EIRNavigationSection>;
    defaultSectionSlug?: string;
}

const SECTION_QUERY_PARAM = 'section';

const getRequestedSectionSlug = (location: ReturnType<typeof useLocation>) => {
    const searchParams = new URLSearchParams(location.search);
    const querySection = searchParams.get(SECTION_QUERY_PARAM);
    const hashSection = decodeURIComponent(location.hash.replace(/^#/, ''));

    return querySection || hashSection || undefined;
};

export const useEirNavigation = (params: UseEirNavigationParams) => {
    const {
        tree,
        flatSections,
        sectionsBySlug,
        defaultSectionSlug,
    } = params;
    const location = useLocation();
    const navigate = useNavigate();
    const requestedSlug = useMemo(() => getRequestedSectionSlug(location), [location]);
    const [expandedIds, setExpandedIds] = useState<string[]>([]);

    const activeSection = useMemo(() => {
        const requestedSection = requestedSlug ? sectionsBySlug[requestedSlug] : undefined;

        if (requestedSection && !requestedSection.isContainer) {
            return requestedSection;
        }

        return defaultSectionSlug ? sectionsBySlug[defaultSectionSlug] : undefined;
    }, [defaultSectionSlug, requestedSlug, sectionsBySlug]);

    const currentPath = useMemo(() => {
        if (!activeSection) {
            return [] as EIRNavigationSection[];
        }

        const path: EIRNavigationSection[] = [];
        let cursor: EIRNavigationSection | undefined = activeSection;

        while (cursor) {
            path.unshift(cursor);
            cursor = cursor.parentId ? sectionsBySlug[cursor.parentId] : undefined;
        }

        return path;
    }, [activeSection, sectionsBySlug]);
    const expandedSet = useMemo(() => new Set(expandedIds), [expandedIds]);

    const selectSection = useCallback((slug: string, replace = false) => {
        const section = sectionsBySlug[slug];

        if (!section) {
            return;
        }

        const parentIds: string[] = [];
        let cursor = section.parentId ? sectionsBySlug[section.parentId] : undefined;

        while (cursor) {
            parentIds.unshift(cursor.slug);
            cursor = cursor.parentId ? sectionsBySlug[cursor.parentId] : undefined;
        }

        setExpandedIds((current) => Array.from(new Set([...current, ...parentIds])));

        const searchParams = new URLSearchParams(location.search);
        searchParams.set(SECTION_QUERY_PARAM, slug);

        navigate(
            `${location.pathname}?${searchParams.toString()}#${slug}`,
            { replace },
        );

        const pageRoot = document.getElementById(PAGE_ID);

        if (pageRoot) {
            pageRoot.scrollTo({ top: 0, behavior: replace ? 'auto' : 'smooth' });
        }
    }, [location.pathname, location.search, navigate, sectionsBySlug]);

    const toggleExpanded = useCallback((slug: string) => {
        setExpandedIds((current) => (
            current.includes(slug)
                ? current.filter((id) => id !== slug)
                : [...current, slug]
        ));
    }, []);

    useEffect(() => {
        if (!defaultSectionSlug) {
            return;
        }

        if (!activeSection) {
            selectSection(defaultSectionSlug, true);
        }
    }, [activeSection, defaultSectionSlug, selectSection]);


    const currentIndex = activeSection ? flatSections.findIndex((section) => section.slug === activeSection.slug) : -1;
    const previousSection = currentIndex > 0 ? flatSections[currentIndex - 1] : undefined;
    const nextSection = currentIndex >= 0 ? flatSections[currentIndex + 1] : undefined;

    return {
        activeSection,
        currentPath,
        expandedSet,
        previousSection,
        nextSection,
        selectSection,
        toggleExpanded,
    };
};
