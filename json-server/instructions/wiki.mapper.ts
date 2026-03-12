import { InstructionArticle, InstructionBreadcrumb, InstructionNavNode, WikiPageDto } from './types';

interface NormalizedBreadcrumb {
    title: string;
    slug: string;
}

const FALLBACK_CONTENT = 'Content is missing';
const TREE_MACRO_PATTERN = /^\{%\s*tree\b[\s\S]*?%\}\s*$/gim;
const WIKI_URL_PATTERN = /^https?:\/\/wiki\.yandex\.ru\/(.+?)\/?$/i;
const ROOT_SECTION_TITLE_MAP: Record<string, string> = {
    obshhie: '\u041e\u0431\u0449\u0438\u0435',
    ar: '\u0410\u0420',
    kr: '\u041a\u0420',
    ov: '\u041e\u0412',
    vk: '\u0412\u041a',
    jel: '\u042d\u041b',
    nivz: '\u041d\u0418\u0412\u0417',
};

export const getResolvedSlug = (page: WikiPageDto): string => String(page.slug || page.supertag || page.id || '').trim();

export const getResolvedTitle = (page: WikiPageDto): string => page.title || page.heading || getResolvedSlug(page);

const decodeSlug = (value: string) => {
    try {
        return decodeURIComponent(value);
    } catch {
        return value;
    }
};

const getRawContent = (page: WikiPageDto): string => {
    if (typeof page.content === 'string') {
        return page.content;
    }

    if (page.content && typeof page.content === 'object' && typeof page.content.html === 'string') {
        return page.content.html;
    }

    if (typeof page.body === 'string') {
        return page.body;
    }

    if (page.body && typeof page.body === 'object' && typeof page.body.html === 'string') {
        return page.body.html;
    }

    if (typeof page.html === 'string') {
        return page.html;
    }

    return '';
};

export const stripWikiMacros = (content: string): string => content
    .replace(TREE_MACRO_PATTERN, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

export const getNormalizedContent = (page: WikiPageDto): string => stripWikiMacros(getRawContent(page));

const getContentType = (page: WikiPageDto): 'html' | 'markdown' => {
    const content = getNormalizedContent(page).trim();

    if (!content) {
        return 'markdown';
    }

    return /<\/?[a-z][\s\S]*>/i.test(content) ? 'html' : 'markdown';
};

const stripTags = (value: string): string => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

const slugify = (value: string) =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^\w\u0400-\u04ff\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

export const extractWikiLinkSlugsFromMarkdown = (content: string, baseSlug?: string): string[] => {
    const normalizedBase = (baseSlug || '').replace(/^\/+|\/+$/g, '');
    const slugs = new Set<string>();
    const markdownMatches = Array.from(content.matchAll(/\[[^\]]+]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)).map((match) => match[1]);
    const rawUrlMatches = Array.from(content.matchAll(/https?:\/\/wiki\.yandex\.ru\/[^\s)]+/gi)).map((match) => match[0]);
    const matches = [...markdownMatches, ...rawUrlMatches];

    matches.forEach((candidateMatch) => {
        const rawTarget = candidateMatch?.trim();

        if (!rawTarget) {
            return;
        }

        const wikiUrlMatch = rawTarget.match(WIKI_URL_PATTERN);

        if (wikiUrlMatch) {
            const normalizedSlug = decodeSlug(wikiUrlMatch[1]).replace(/^\/+|\/+$/g, '');

            if (normalizedSlug && !normalizedSlug.includes('/.files/') && !normalizedSlug.includes('/images/')) {
                slugs.add(normalizedSlug);
            }

            return;
        }

        if (rawTarget.startsWith('http://') || rawTarget.startsWith('https://') || rawTarget.startsWith('#')) {
            return;
        }

        let candidate = rawTarget;

        if (candidate.startsWith('/')) {
            candidate = candidate.replace(/^\/+|\/+$/g, '');
        } else if (candidate.startsWith('./')) {
            if (!normalizedBase) {
                return;
            }

            candidate = `${normalizedBase}/${candidate.replace(/^\.\//, '')}`;
        } else if (normalizedBase && !candidate.startsWith(normalizedBase)) {
            candidate = `${normalizedBase}/${candidate}`;
        }

        const normalizedSlug = decodeSlug(candidate).replace(/^\/+|\/+$/g, '');

        if (normalizedSlug && !normalizedSlug.includes('/.files/') && !normalizedSlug.includes('/images/')) {
            slugs.add(normalizedSlug);
        }
    });

    return Array.from(slugs);
};

export const mapInstructionSectionSlugToTitle = (slug: string): string => {
    const segment = slug.split('/').filter(Boolean).pop() || slug;
    const mappedTitle = ROOT_SECTION_TITLE_MAP[segment.toLowerCase()];

    if (mappedTitle) {
        return mappedTitle;
    }

    return segment.replace(/[-_]+/g, ' ').toUpperCase();
};

const extractTocFromHtml = (content: string) => {
    const toc = [];
    const seenIds = new Set<string>();
    const headingPattern = /<(h[23])(?:\s+[^>]*)?>([\s\S]*?)<\/\1>/gi;
    let match = headingPattern.exec(content);

    while (match) {
        const [, tagName, headingHtml] = match;
        const title = stripTags(headingHtml);

        if (title) {
            const baseId = slugify(title) || `section-${toc.length + 1}`;
            let nextId = baseId;
            let suffix = 1;

            while (seenIds.has(nextId)) {
                suffix += 1;
                nextId = `${baseId}-${suffix}`;
            }

            seenIds.add(nextId);
            toc.push({
                id: nextId,
                title,
                level: tagName.toLowerCase() === 'h2' ? 2 : 3,
            });
        }

        match = headingPattern.exec(content);
    }

    return toc;
};

const stripMarkdownInline = (value: string): string => value
    .replace(/!\[[^\]]*]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .trim();

const extractTocFromMarkdown = (content: string) => {
    const seenIds = new Set<string>();

    return content
        .split(/\r?\n/)
        .map((line) => line.match(/^(#{1,3})\s+(.+)$/))
        .filter((match): match is RegExpMatchArray => Boolean(match))
        .map((match, index) => {
            const headingLevel = match[1].length;
            const level = Math.min(Math.max(headingLevel, 2), 3) as 2 | 3;
            const rawTitle = stripMarkdownInline(match[2]).replace(/\s+#+\s*$/, '').trim();
            const title = rawTitle || `section-${index + 1}`;
            const baseId = slugify(title) || `section-${index + 1}`;
            let nextId = baseId;
            let suffix = 1;

            while (seenIds.has(nextId)) {
                suffix += 1;
                nextId = `${baseId}-${suffix}`;
            }

            seenIds.add(nextId);

            return {
                id: nextId,
                title,
                level,
            };
        });
};

const createBreadcrumb = (input: { title?: string; slug?: string; supertag?: string; heading?: string }): NormalizedBreadcrumb | null => {
    const slug = String(input.slug || input.supertag || '').trim();
    const title = String(input.title || input.heading || slug).trim();

    if (!slug || !title) {
        return null;
    }

    return { title, slug };
};

export const getBreadcrumbs = (page: WikiPageDto, rootPage?: WikiPageDto): NormalizedBreadcrumb[] => {
    const rootCrumb = rootPage ? createBreadcrumb(rootPage) : null;
    const breadcrumbs = (page.breadcrumbs || [])
        .map((crumb) => createBreadcrumb(crumb))
        .filter((crumb): crumb is NormalizedBreadcrumb => Boolean(crumb));
    const pageSlug = getResolvedSlug(page);
    const pageTitle = getResolvedTitle(page);
    const parentCrumb = page.parent ? createBreadcrumb(page.parent) : null;
    const chain = [
        ...(rootCrumb ? [rootCrumb] : []),
        ...(parentCrumb && !breadcrumbs.some((crumb) => crumb.slug === parentCrumb.slug) ? [parentCrumb] : []),
        ...breadcrumbs,
    ].filter((crumb, index, items) => items.findIndex((item) => item.slug === crumb.slug) === index);

    if (pageSlug && !chain.some((crumb) => crumb.slug === pageSlug)) {
        chain.push({
            title: pageTitle,
            slug: pageSlug,
        });
    }

    return chain;
};

const getEmbeddedChildren = (page: WikiPageDto): WikiPageDto[] => {
    const nestedCollections = [page.children, page.subpages, page.pages, page.items, page.results];

    return nestedCollections
        .filter((collection): collection is WikiPageDto[] => Array.isArray(collection))
        .flat();
};

export const collectEmbeddedPages = (page: WikiPageDto): WikiPageDto[] => {
    const result: WikiPageDto[] = [];
    const seen = new Set<string>();

    const visit = (current: WikiPageDto) => {
        getEmbeddedChildren(current).forEach((child) => {
            const slug = getResolvedSlug(child);

            if (!slug || seen.has(slug)) {
                return;
            }

            seen.add(slug);
            result.push(child);
            visit(child);
        });
    };

    visit(page);

    return result;
};

export const mapWikiPageToInstructionNode = (page: WikiPageDto): InstructionNavNode => ({
    id: String(page.id || getResolvedSlug(page)),
    title: getResolvedTitle(page),
    slug: getResolvedSlug(page),
    children: [],
});

const createLeafNode = (page: WikiPageDto): InstructionNavNode => ({
    id: String(page.id || getResolvedSlug(page)),
    title: getResolvedTitle(page),
    slug: getResolvedSlug(page),
});

export const mapWikiPagesToInstructionTree = (rootPage: WikiPageDto, pages: WikiPageDto[]): InstructionNavNode[] => {
    const rootSlug = getResolvedSlug(rootPage);
    const rootTitle = getResolvedTitle(rootPage);
    const pageMap = new Map<string, WikiPageDto>();

    pages.forEach((page) => {
        const slug = getResolvedSlug(page);

        if (slug && slug !== rootSlug) {
            pageMap.set(slug, page);
        }
    });

    const normalizedPages = Array.from(pageMap.values());
    const hierarchyParents = new Set<string>();

    normalizedPages.forEach((page) => {
        getBreadcrumbs(page, rootPage).slice(0, -1).forEach((crumb) => {
            if (crumb.slug && crumb.slug !== rootSlug) {
                hierarchyParents.add(crumb.slug);
            }
        });
    });

    const categoryMap = new Map<string, InstructionNavNode>();

    normalizedPages.forEach((page) => {
        const pageSlug = getResolvedSlug(page);

        if (!pageSlug || hierarchyParents.has(pageSlug)) {
            return;
        }

        const breadcrumbs = getBreadcrumbs(page, rootPage);
        const relativeBreadcrumbs = breadcrumbs.filter((crumb) => crumb.slug !== rootSlug);
        const categoryCrumb = relativeBreadcrumbs.length > 1 ? relativeBreadcrumbs[0] : null;
        const categorySlug = categoryCrumb?.slug || rootSlug;
        const categoryTitle = categoryCrumb?.title || rootTitle;

        if (!categoryMap.has(categorySlug)) {
            categoryMap.set(categorySlug, {
                id: categorySlug,
                slug: categorySlug,
                title: categoryTitle,
                children: [],
            });
        }

        categoryMap.get(categorySlug)?.children?.push(createLeafNode(page));
    });

    const mappedTree = Array.from(categoryMap.values())
        .filter((node) => node.children?.length)
        .map((node) => ({
            ...node,
            children: node.children?.sort((left, right) => left.title.localeCompare(right.title, 'ru')),
        }))
        .sort((left, right) => left.title.localeCompare(right.title, 'ru'));

    if (mappedTree.length) {
        return mappedTree;
    }

    return [mapWikiPageToInstructionNode({
        ...rootPage,
        title: rootTitle,
        slug: rootSlug,
    })];
};

export const mapWikiPageToInstructionArticle = (page: WikiPageDto, rootPage: WikiPageDto): InstructionArticle => {
    const rootSlug = getResolvedSlug(rootPage);
    const rootTitle = getResolvedTitle(rootPage);
    const resolvedSlug = getResolvedSlug(page);
    const breadcrumbs = getBreadcrumbs(page, rootPage);
    const categoryCrumb = breadcrumbs.find((crumb) => crumb.slug !== rootSlug && crumb.slug !== resolvedSlug);
    const articleBreadcrumbs: InstructionBreadcrumb[] = breadcrumbs.length ? breadcrumbs : [
        {
            title: rootTitle,
            slug: rootSlug,
        },
        {
            title: getResolvedTitle(page),
            slug: resolvedSlug,
        },
    ];

    const isRootArticle = resolvedSlug === rootSlug;
    const content = isRootArticle ? '' : getNormalizedContent(page);
    const contentType = getContentType(page);
    let toc = [];

    if (content) {
        toc = contentType === 'html'
            ? extractTocFromHtml(content)
            : extractTocFromMarkdown(content);
    }

    return {
        id: String(page.id || resolvedSlug),
        title: getResolvedTitle(page),
        slug: resolvedSlug,
        kind: 'article',
        category: categoryCrumb?.title || rootTitle,
        parentCategory: categoryCrumb?.slug,
        breadcrumbs: articleBreadcrumbs,
        content: isRootArticle ? '' : (content || FALLBACK_CONTENT),
        contentType,
        updatedAt: page.updatedAt || page.modifiedAt || page.updated_at || page.attributes?.modified_at || page.attributes?.created_at,
        toc,
        items: [],
    };
};
