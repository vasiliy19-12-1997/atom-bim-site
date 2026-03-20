import { InstructionNavNode, WikiPageDto } from './types';
import { getResolvedSlug, getResolvedTitle, mapInstructionSectionSlugToTitle, stripWikiMacros } from './wiki.mapper';

export interface InstructionIndexNode {
    slug: string;
    title: string;
    type: 'section' | 'article';
    children: InstructionIndexNode[];
}

const WIKI_URL_PATTERN = /^https?:\/\/wiki\.yandex\.ru\/(.+?)\/?$/i;
const MARKDOWN_LINK_PATTERN = /^\[([^\]]+)]\(([^)\s]+)(?:\s+"[^"]*")?\)$/;
const LIST_ITEM_PATTERN = /^(\s*)(?:[-*+]|\d+\.)\s+(.+)$/;

const decodeSlug = (value: string) => {
    try {
        return decodeURIComponent(value);
    } catch {
        return value;
    }
};

const normalizeSlug = (value: string): string => decodeSlug(value).replace(/^\/+|\/+$/g, '');

const getIndexSlug = (): string => String(process.env.YANDEX_WIKI_INDEX_SLUG || process.env.YANDEX_WIKI_ROOT_SLUG || '').trim();

const resolveTargetToSlug = (rawTarget: string, baseSlug: string): string | null => {
    const trimmed = rawTarget.trim();

    if (!trimmed || trimmed.startsWith('#')) {
        return null;
    }

    const urlMatch = trimmed.match(WIKI_URL_PATTERN);

    if (urlMatch) {
        return normalizeSlug(urlMatch[1]);
    }

    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        return null;
    }

    if (trimmed.startsWith('/')) {
        return normalizeSlug(trimmed);
    }

    if (trimmed.startsWith('./')) {
        return normalizeSlug(`${baseSlug}/${trimmed.replace(/^\.\//, '')}`);
    }

    return normalizeSlug(trimmed);
};

const parseLinkToken = (rawValue: string, baseSlug: string): { slug: string; title?: string } | null => {
    const trimmed = rawValue.trim();
    const markdownLinkMatch = trimmed.match(MARKDOWN_LINK_PATTERN);

    if (markdownLinkMatch) {
        const [, title, target] = markdownLinkMatch;
        const slug = resolveTargetToSlug(target, baseSlug);

        return slug ? { slug, title: title.trim() } : null;
    }

    const slug = resolveTargetToSlug(trimmed, baseSlug);

    return slug ? { slug } : null;
};

const getIndentDepth = (whitespace: string): number => Math.floor(whitespace.replace(/\t/g, '    ').length / 2);

const getFallbackTitle = (slug: string, rootSlug: string): string => {
    const relativeSegments = slug.split('/').filter(Boolean);
    const rootSegments = rootSlug.split('/').filter(Boolean);

    if (relativeSegments.length === rootSegments.length + 1) {
        return mapInstructionSectionSlugToTitle(slug);
    }

    return relativeSegments[relativeSegments.length - 1] || slug;
};

export const fetchInstructionsIndexSlug = (): string => getIndexSlug();

export const fetchWikiPageBySlug = async (
    slug: string,
    fetcher: (targetSlug: string) => Promise<WikiPageDto | null>,
): Promise<WikiPageDto | null> => fetcher(slug);

export const fetchInstructionsIndex = async (
    fetcher: (targetSlug: string) => Promise<WikiPageDto | null>,
): Promise<WikiPageDto | null> => {
    const indexSlug = getIndexSlug();

    if (!indexSlug) {
        return null;
    }

    return fetchWikiPageBySlug(indexSlug, fetcher);
};

export const parseInstructionsIndex = (content: string, rootSlug: string): InstructionIndexNode[] => {
    const sanitizedContent = stripWikiMacros(content);
    const lines = sanitizedContent.split(/\r?\n/);
    const roots: InstructionIndexNode[] = [];
    const stack: Array<{ depth: number; node: InstructionIndexNode }> = [];

    lines.forEach((line) => {
        const trimmedLine = line.trim();

        if (!trimmedLine) {
            return;
        }

        const listMatch = line.match(LIST_ITEM_PATTERN);
        const depth = listMatch ? getIndentDepth(listMatch[1]) : 0;
        const rawToken = listMatch ? listMatch[2].trim() : trimmedLine;
        const parsedLink = parseLinkToken(rawToken, rootSlug);

        if (!parsedLink || !parsedLink.slug.startsWith(`${rootSlug}/`) || parsedLink.slug === rootSlug) {
            return;
        }

        const node: InstructionIndexNode = {
            slug: parsedLink.slug,
            title: parsedLink.title || getFallbackTitle(parsedLink.slug, rootSlug),
            type: 'article',
            children: [],
        };

        while (stack.length && stack[stack.length - 1].depth >= depth) {
            stack.pop();
        }

        const parent = stack[stack.length - 1]?.node;

        if (parent) {
            parent.children.push(node);
            parent.type = 'section';
        } else {
            node.type = 'section';
            roots.push(node);
        }

        stack.push({ depth, node });
    });

    return roots;
};

const uniqueNodes = (nodes: InstructionIndexNode[]): InstructionIndexNode[] => {
    const result: InstructionIndexNode[] = [];
    const seen = new Set<string>();

    nodes.forEach((node) => {
        if (seen.has(node.slug)) {
            return;
        }

        seen.add(node.slug);
        result.push({
            ...node,
            children: uniqueNodes(node.children),
        });
    });

    return result;
};

export const buildInstructionsTree = async (
    indexNodes: InstructionIndexNode[],
    resolvePage: (slug: string) => Promise<WikiPageDto | null>,
    onWarning: (context: string, payload: unknown) => void,
): Promise<InstructionNavNode[]> => {
    const visit = async (node: InstructionIndexNode): Promise<InstructionNavNode | null> => {
        const page = await resolvePage(node.slug);

        if (!page) {
            onWarning('skipped index node without accessible page', {
                slug: node.slug,
                title: node.title,
            });
            return null;
        }

        const children = await Promise.all(node.children.map((child) => visit(child)));
        const resolvedChildren = children.filter((child): child is InstructionNavNode => Boolean(child));
        const pageSlug = getResolvedSlug(page);

        return {
            id: String(page.id || pageSlug),
            slug: pageSlug,
            title: getResolvedTitle(page) || node.title,
            type: resolvedChildren.length || node.type === 'section' ? 'section' : 'article',
            children: resolvedChildren,
        };
    };

    const nodes = await Promise.all(uniqueNodes(indexNodes).map((node) => visit(node)));

    return nodes.filter((node): node is InstructionNavNode => Boolean(node));
};
