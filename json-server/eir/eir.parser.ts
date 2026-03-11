import mammoth from 'mammoth';
import { EIRDocumentResponse, EIRSection, EIRTocItem } from './types';

interface HeadingMeta {
    id: string;
    level: 1 | 2 | 3;
    title: string;
    start: number;
    headingHtml: string;
}

interface ParseDocxInput {
    filePath: string;
    id: string;
    slug: string;
    title: string;
    breadcrumbs: EIRDocumentResponse['breadcrumbs'];
    updatedAt?: string;
}

const HEADING_REGEX = /<h([1-3])[^>]*>([\s\S]*?)<\/h\1>/gi;

const stripTags = (value: string): string => value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

const slugify = (value: string): string => value
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\u0400-\u04ff\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const sanitizeHtml = (html: string): string => {
    const withoutDangerousBlocks = html
        .replace(/<(script|style|iframe|object|embed|form|input|button|textarea)[^>]*>[\s\S]*?<\/\1>/gi, '')
        .replace(/<(script|style|iframe|object|embed|form|input|button|textarea)([^>]*)\/>/gi, '');

    return withoutDangerousBlocks
        .replace(/\s(on\w+|style|srcdoc)=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
        .replace(/\s(href|src)=("\s*javascript:[^"]*"|'\s*javascript:[^']*')/gi, '');
};

const addIdsToHeadings = (html: string): { htmlWithIds: string; toc: EIRTocItem[] } => {
    const usedIds = new Set<string>();
    const toc: EIRTocItem[] = [];

    const htmlWithIds = html.replace(HEADING_REGEX, (fullMatch, levelRaw: string, innerHtml: string) => {
        const level = Number(levelRaw) as 1 | 2 | 3;
        const title = stripTags(innerHtml) || `section-${toc.length + 1}`;
        const baseId = slugify(title) || `section-${toc.length + 1}`;

        let uniqueId = baseId;
        let suffix = 1;
        while (usedIds.has(uniqueId)) {
            suffix += 1;
            uniqueId = `${baseId}-${suffix}`;
        }

        usedIds.add(uniqueId);
        toc.push({ id: uniqueId, title, level });

        return `<h${level} id="${uniqueId}">${innerHtml}</h${level}>`;
    });

    return {
        htmlWithIds,
        toc,
    };
};

const collectHeadings = (html: string): HeadingMeta[] => {
    const headings: HeadingMeta[] = [];

    const regex = /<h([1-3]) id="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/gi;
    let match = regex.exec(html);

    while (match) {
        const [headingHtml, levelRaw, id, innerHtml] = match;

        headings.push({
            id,
            level: Number(levelRaw) as 1 | 2 | 3,
            title: stripTags(innerHtml) || id,
            start: match.index,
            headingHtml,
        });

        match = regex.exec(html);
    }

    return headings;
};

const buildSections = (html: string, headings: HeadingMeta[]): EIRSection[] => {
    const rootSections: EIRSection[] = [];
    const stack: EIRSection[] = [];

    headings.forEach((heading, index) => {
        const { start } = heading;
        const end = index + 1 < headings.length ? headings[index + 1].start : html.length;
        const sectionHtml = html.slice(start, end).trim();

        const section: EIRSection = {
            id: heading.id,
            title: heading.title,
            level: heading.level,
            html: sectionHtml,
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
            rootSections.push(section);
        }

        stack.push(section);
    });

    return rootSections;
};

const resolveDocumentTitle = (defaultTitle: string, toc: EIRTocItem[]): string => {
    const firstHeading = toc.find((item) => item.level === 1);
    return firstHeading?.title || defaultTitle;
};

const convertDocxToHtml = async (filePath: string): Promise<string> => {
    const result = await mammoth.convertToHtml(
        { path: filePath },
        {
            convertImage: mammoth.images.inline(async (element) => {
                const imageBuffer = await element.read('base64');
                return {
                    src: `data:${element.contentType};base64,${imageBuffer}`,
                };
            }),
        },
    );

    return result.value;
};

export const parseEirDocxDocument = async (input: ParseDocxInput): Promise<EIRDocumentResponse> => {
    const rawHtml = await convertDocxToHtml(input.filePath);
    const sanitizedHtml = sanitizeHtml(rawHtml);
    const { htmlWithIds, toc } = addIdsToHeadings(sanitizedHtml);
    const headings = collectHeadings(htmlWithIds);
    const sections = buildSections(htmlWithIds, headings);

    return {
        id: input.id,
        slug: input.slug,
        title: resolveDocumentTitle(input.title, toc),
        breadcrumbs: input.breadcrumbs,
        content: htmlWithIds,
        sections,
        toc,
        updatedAt: input.updatedAt,
    };
};
