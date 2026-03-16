import { useMemo } from 'react';
import { EIRDocumentResponse, EIRSection } from '@/entities/EIR';
import { prepareEirHtml } from './prepareEirHtml';
import { buildEirTree } from './buildEirTree';
import { buildSectionBoundaries } from './buildSectionBoundaries';
import { flattenEirTree } from './flattenEirTree';
import { EIRNavigationSection, EIRSectionBoundary } from './types';

const mapDocumentSectionsToNavigation = (
    sections: EIRSection[],
    parentId?: string,
): EIRNavigationSection[] => sections.map((section) => ({
    id: section.id,
    slug: section.id,
    title: section.title,
    level: section.level,
    parentId,
    startIndex: 0,
    endIndex: 0,
    fragmentHtml: section.html,
    children: mapDocumentSectionsToNavigation(section.children || [], section.id),
}));

export const useEirSections = (document?: EIRDocumentResponse) => useMemo(() => {
    if (!document) {
        return {
            preparedHtml: '',
            boundaries: [] as EIRSectionBoundary[],
            tree: [] as EIRNavigationSection[],
            flatSections: [] as EIRNavigationSection[],
            sectionsBySlug: {} as Record<string, EIRNavigationSection>,
            defaultSectionSlug: undefined as string | undefined,
        };
    }

    const prepared = prepareEirHtml(document.content, document.toc);
    const boundaries = buildSectionBoundaries(prepared.html, prepared.toc);
    const sectionsTree = document.sections?.length
        ? mapDocumentSectionsToNavigation(document.sections)
        : undefined;
    const effectiveBoundaries = boundaries.length
        ? boundaries
        : [{
            id: document.slug || document.id,
            slug: document.slug || document.id,
            title: document.title,
            level: 1,
            startIndex: 0,
            endIndex: prepared.html.length,
        }];

    const tree = sectionsTree?.length ? sectionsTree : buildEirTree(effectiveBoundaries);
    const flatSections = flattenEirTree(tree);
    const hasSingleRootContainer = tree.length === 1 && tree[0].level === 1 && tree[0].children.length > 0;

    if (hasSingleRootContainer) {
        tree[0].isContainer = true;
    }

    const navigableFlatSections = hasSingleRootContainer
        ? flatSections.filter((section) => section.id !== tree[0].id)
        : flatSections;
    const sectionsBySlug = flatSections.reduce<Record<string, EIRNavigationSection>>((acc, section) => {
        acc[section.slug] = section;
        return acc;
    }, {});

    return {
        preparedHtml: prepared.html,
        boundaries: effectiveBoundaries,
        tree,
        flatSections: navigableFlatSections,
        sectionsBySlug,
        defaultSectionSlug: navigableFlatSections[0]?.slug,
    };
}, [document]);
