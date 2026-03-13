import { EIRTocItem } from '@/entities/EIR';
import { EIRSectionBoundary } from './types';

interface HeadingMatch {
    id: string;
    title: string;
    level: number;
    startIndex: number;
}

const HEADING_REGEX = /<h([1-6])\b([^>]*)id=(['"])(.*?)\3[^>]*>([\s\S]*?)<\/h\1>/gi;
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

const collectHeadings = (html: string, toc: EIRTocItem[]): HeadingMatch[] => {
    const tocById = toc.reduce<Record<string, EIRTocItem>>((acc, item) => {
        acc[item.id] = item;
        return acc;
    }, {});
    const headings: HeadingMatch[] = [];
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

export const buildSectionBoundaries = (html: string, toc: EIRTocItem[]): EIRSectionBoundary[] => {
    const headings = collectHeadings(html, toc);

    return headings.map((heading, index) => {
        let endIndex = html.length;

        for (let nextIndex = index + 1; nextIndex < headings.length; nextIndex += 1) {
            const nextHeading = headings[nextIndex];

            if (nextHeading.level <= heading.level) {
                endIndex = nextHeading.startIndex;
                break;
            }
        }

        return {
            id: heading.id,
            slug: heading.id || fallbackSlug(heading.title) || `section-${index + 1}`,
            title: heading.title,
            level: heading.level,
            startIndex: heading.startIndex,
            endIndex,
        };
    });
};
