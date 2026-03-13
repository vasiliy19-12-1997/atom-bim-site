import { useMemo } from 'react';
import { EIRDocumentResponse } from '@/entities/EIR';
import { prepareEirHtml } from './prepareEirHtml';
import { buildEirTree } from './buildEirTree';
import { buildSectionBoundaries } from './buildSectionBoundaries';
import { flattenEirTree } from './flattenEirTree';
import { EIRNavigationSection, EIRSectionBoundary } from './types';

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

    const tree = buildEirTree(effectiveBoundaries);
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
