import { EIRTocItem } from '@/entities/EIR';
import { EIRSectionBoundary } from './types';

interface SectionMarker {
    id: string;
    title: string;
    level: number;
    startIndex: number;
}

const HEADING_REGEX = /<h([1-6])\b([^>]*)id=(['"])(.*?)\3[^>]*>([\s\S]*?)<\/h\1>/gi;
const ID_ATTRIBUTE_REGEX = /<([a-z0-9]+)\b[^>]*\sid=(['"])(.*?)\2[^>]*>/gi;
const STRIP_TAGS_REGEX = /<[^>]+>/g;

const normalizeText = (value: string) => value
    .replace(STRIP_TAGS_REGEX, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const fallbackSlug = (value: string) => value
    .toLowerCase()
    .replace(/[^\w\u0400-\u04ff\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const collectHeadingMarkers = (html: string, toc: EIRTocItem[]): SectionMarker[] => {
    const tocById = toc.reduce<Record<string, EIRTocItem>>((acc, item) => {
        acc[item.id] = item;
        return acc;
    }, {});
    const headings: SectionMarker[] = [];
    let match = HEADING_REGEX.exec(html);

    while (match) {
        const [, rawLevel, , , id, innerHtml] = match;
        const tocItem = tocById[id];

        headings.push({
            id,
            title: tocItem?.title || normalizeText(innerHtml) || id,
            level: Math.max(tocItem?.level || 0, Number(rawLevel)),
            startIndex: match.index,
        });

        match = HEADING_REGEX.exec(html);
    }

    return headings;
};

const collectAnchorMarkers = (html: string, toc: EIRTocItem[]): SectionMarker[] => {
    const positionsById = toc.reduce<Record<string, number[]>>((acc, item) => {
        acc[item.id] = [];
        return acc;
    }, {});
    let match = ID_ATTRIBUTE_REGEX.exec(html);

    while (match) {
        const [, , , id] = match;

        if (positionsById[id]) {
            positionsById[id].push(match.index);
        }

        match = ID_ATTRIBUTE_REGEX.exec(html);
    }

    return toc.reduce<SectionMarker[]>((acc, item) => {
        const positions = positionsById[item.id];
        const startIndex = positions?.length ? positions[positions.length - 1] : -1;

        if (startIndex >= 0) {
            acc.push({
                id: item.id,
                title: item.title,
                level: item.level,
                startIndex,
            });
        }

        return acc;
    }, []);
};

const collectMarkers = (html: string, toc: EIRTocItem[]): SectionMarker[] => {
    const headingMarkers = collectHeadingMarkers(html, toc);

    if (headingMarkers.length >= toc.length && headingMarkers.length > 1) {
        return headingMarkers;
    }

    const anchorMarkers = collectAnchorMarkers(html, toc);

    if (!anchorMarkers.length) {
        return headingMarkers;
    }

    if (headingMarkers.length > 1) {
        const headingIds = new Set(headingMarkers.map((item) => item.id));
        const mergedMarkers = [
            ...headingMarkers,
            ...anchorMarkers.filter((item) => !headingIds.has(item.id)),
        ];

        return mergedMarkers.sort((left, right) => left.startIndex - right.startIndex);
    }

    return anchorMarkers;
};

export const buildSectionBoundaries = (html: string, toc: EIRTocItem[]): EIRSectionBoundary[] => {
    const markers = collectMarkers(html, toc);

    return markers.map((marker, index) => {
        let endIndex = html.length;

        for (let nextIndex = index + 1; nextIndex < markers.length; nextIndex += 1) {
            const nextMarker = markers[nextIndex];

            if (nextMarker.level <= marker.level) {
                endIndex = nextMarker.startIndex;
                break;
            }
        }

        return {
            id: marker.id,
            slug: marker.id || fallbackSlug(marker.title) || `section-${index + 1}`,
            title: marker.title,
            level: marker.level,
            startIndex: marker.startIndex,
            endIndex,
        };
    });
};
