const MAX_PAGE_WEIGHT = 30;
const MAX_TEXT_WEIGHT = 5;

interface HtmlChunk {
    html: string;
    weight: number;
}

const getTextWeight = (text: string): number => {
    const normalizedLength = text.replace(/\s+/g, ' ').trim().length;

    if (!normalizedLength) {
        return 0;
    }

    return Math.min(MAX_TEXT_WEIGHT, Math.max(1, Math.ceil(normalizedLength / 450)));
};

const getNodeWeight = (node: ChildNode): number => {
    if (node.nodeType === Node.TEXT_NODE) {
        return getTextWeight(node.textContent || '');
    }

    if (!(node instanceof HTMLElement)) {
        return 1;
    }

    const tagName = node.tagName.toLowerCase();

    if (/^h[1-6]$/.test(tagName)) {
        return 3;
    }

    if (tagName === 'table') {
        return 8;
    }

    if (tagName === 'figure' || tagName === 'img') {
        return 6;
    }

    if (tagName === 'ul' || tagName === 'ol') {
        return Math.max(2, getTextWeight(node.textContent || ''));
    }

    return getTextWeight(node.textContent || '') || 1;
};

const serializeNode = (node: ChildNode): string => {
    if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent || '';
    }

    if (node instanceof HTMLElement) {
        return node.outerHTML;
    }

    return '';
};

const isHeadingNode = (node: ChildNode): boolean => node instanceof HTMLElement
    && /^h[1-6]$/.test(node.tagName.toLowerCase());

const isMeaningfulNode = (node: ChildNode): boolean => serializeNode(node).trim().length > 0;

const paginateByWeight = (chunks: HtmlChunk[]): string[] => {
    const pages: string[] = [];
    let currentPageParts: string[] = [];
    let currentWeight = 0;

    chunks.forEach((chunk) => {
        const shouldStartNewPage = currentPageParts.length > 0
            && currentWeight + chunk.weight > MAX_PAGE_WEIGHT;

        if (shouldStartNewPage) {
            pages.push(currentPageParts.join(''));
            currentPageParts = [];
            currentWeight = 0;
        }

        currentPageParts.push(chunk.html);
        currentWeight += chunk.weight;
    });

    if (currentPageParts.length > 0) {
        pages.push(currentPageParts.join(''));
    }

    return pages;
};

const buildSimpleChunks = (nodes: ChildNode[]): HtmlChunk[] => nodes.map((node) => ({
    html: serializeNode(node),
    weight: getNodeWeight(node),
}));

const buildHeadingChunks = (nodes: ChildNode[]): HtmlChunk[] => {
    const chunks: HtmlChunk[] = [];
    let introParts: string[] = [];
    let introWeight = 0;
    let currentChunk: HtmlChunk | null = null;

    nodes.forEach((node) => {
        const html = serializeNode(node);
        const weight = getNodeWeight(node);

        if (isHeadingNode(node)) {
            if (currentChunk) {
                chunks.push(currentChunk);
            }

            currentChunk = {
                html: `${introParts.join('')}${html}`,
                weight: introWeight + weight,
            };
            introParts = [];
            introWeight = 0;
            return;
        }

        if (currentChunk) {
            currentChunk.html += html;
            currentChunk.weight += weight;
            return;
        }

        introParts.push(html);
        introWeight += weight;
    });

    if (currentChunk) {
        chunks.push(currentChunk);
    } else if (introParts.length > 0) {
        chunks.push({
            html: introParts.join(''),
            weight: introWeight,
        });
    }

    return chunks.filter((chunk) => chunk.html.trim().length > 0);
};

export const paginateEirHtml = (html: string): string[] => {
    if (typeof window === 'undefined' || !html.trim()) {
        return html.trim() ? [html] : [];
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(`<body>${html}</body>`, 'text/html');
    const nodes = Array.from(doc.body.childNodes).filter(isMeaningfulNode);

    if (!nodes.length) {
        return [];
    }

    const chunks = nodes.some(isHeadingNode)
        ? buildHeadingChunks(nodes)
        : buildSimpleChunks(nodes);

    return paginateByWeight(chunks);
};
