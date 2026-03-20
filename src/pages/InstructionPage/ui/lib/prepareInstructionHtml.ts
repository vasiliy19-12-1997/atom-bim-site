import { InstructionArticle, InstructionTocItem } from '@/entities/Instruction';

interface PreparedInstructionHtml {
    html: string;
    toc: InstructionTocItem[];
}

const DANGEROUS_TAGS = ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'textarea'];
const SCRIPT_PROTOCOL = /^java[\s]*script:/i;
const ABSOLUTE_URL = /^(?:[a-z]+:)?\/\//i;

const slugify = (value: string) =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^\w\u0400-\u04ff\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

const escapeHtml = (value: string) => value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const sanitizeNodeAttributes = (element: Element) => {
    const { attributes } = element;
    for (let i = attributes.length - 1; i >= 0; i -= 1) {
        const attribute = attributes[i];
        const name = attribute.name.toLowerCase();
        const value = attribute.value.trim().toLowerCase();

        const shouldDropEventOrInlineAttribute = name.startsWith('on') || name === 'srcdoc' || name === 'style';
        const shouldDropScriptProtocol = (name === 'href' || name === 'src') && SCRIPT_PROTOCOL.test(value);

        if (shouldDropEventOrInlineAttribute || shouldDropScriptProtocol) {
            element.removeAttribute(attribute.name);
        }
    }
};

const extractMarkdownTarget = (rawUrl: string) => {
    const trimmed = rawUrl.trim();
    const sizeMatch = trimmed.match(/\s+=\s*(\d*)x(\d*)\s*$/i);
    const cleanUrl = sizeMatch ? trimmed.slice(0, sizeMatch.index).trim() : trimmed;

    return {
        url: cleanUrl,
        width: sizeMatch?.[1] || '',
        height: sizeMatch?.[2] || '',
    };
};

const normalizeWikiUrl = (rawUrl: string, slug: string): string => {
    const { url } = extractMarkdownTarget(rawUrl);
    const value = url.trim();

    if (!value || ABSOLUTE_URL.test(value) || value.startsWith('data:')) {
        return value;
    }

    if (value.startsWith('/')) {
        return `https://wiki.yandex.ru${value}`;
    }

    const encodedSegments = slug
        .split('/')
        .filter(Boolean)
        .map((segment) => encodeURIComponent(segment));
    const articlePath = encodedSegments.join('/');
    const normalizedRelativePath = value.replace(/^\.\//, '');

    return articlePath
        ? `https://wiki.yandex.ru/${articlePath}/${normalizedRelativePath}`
        : `https://wiki.yandex.ru/${normalizedRelativePath}`;
};

const buildImageProxyUrl = (rawUrl: string, slug: string): string => {
    const target = extractMarkdownTarget(rawUrl);
    const params = new URLSearchParams({
        slug,
        path: target.url,
    });

    return `/api/instructions/file?${params.toString()}`;
};

const applyInlineMarkdown = (value: string, slug: string): string => {
    let result = escapeHtml(value);

    result = result.replace(/!\[([^\]]*)]\(([^)]+)\)/g, (_match, alt, rawUrl) => {
        const target = extractMarkdownTarget(rawUrl);
        const attributes = [
            `src="${escapeHtml(buildImageProxyUrl(target.url, slug))}"`,
            `alt="${escapeHtml(alt)}"`,
        ];

        if (target.width) {
            attributes.push(`width="${escapeHtml(target.width)}"`);
        }

        if (target.height) {
            attributes.push(`height="${escapeHtml(target.height)}"`);
        }

        return `<img ${attributes.join(' ')} />`;
    });
    result = result.replace(/\[([^\]]+)]\(([^)]+)\)/g, (_match, text, url) => (
        `<a href="${escapeHtml(normalizeWikiUrl(url, slug))}" target="_blank" rel="noreferrer">${escapeHtml(text)}</a>`
    ));
    result = result.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    result = result.replace(/__([^_]+)__/g, '<strong>$1</strong>');
    result = result.replace(/`([^`]+)`/g, '<code>$1</code>');

    return result;
};

const renderMarkdownToHtml = (content: string, slug: string): string => {
    const lines = content.replace(/\r\n/g, '\n').split('\n');
    const html: string[] = [];
    let paragraphBuffer: string[] = [];
    let listItems: string[] = [];

    const flushParagraph = () => {
        if (paragraphBuffer.length) {
            html.push(`<p>${applyInlineMarkdown(paragraphBuffer.join(' ').trim(), slug)}</p>`);
            paragraphBuffer = [];
        }
    };

    const flushList = () => {
        if (listItems.length) {
            html.push(`<ul>${listItems.join('')}</ul>`);
            listItems = [];
        }
    };

    lines.forEach((line) => {
        const trimmed = line.trim();

        if (!trimmed) {
            flushParagraph();
            flushList();
            return;
        }

        const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)$/);
        if (headingMatch) {
            flushParagraph();
            flushList();
            const level = Math.min(headingMatch[1].length, 3);
            const title = headingMatch[2].replace(/\s+#+\s*$/, '').trim();
            html.push(`<h${level}>${applyInlineMarkdown(title, slug)}</h${level}>`);
            return;
        }

        if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
            flushParagraph();
            flushList();
            html.push('<hr />');
            return;
        }

        const listMatch = trimmed.match(/^[-*]\s+(.+)$/);
        if (listMatch) {
            flushParagraph();
            listItems.push(`<li>${applyInlineMarkdown(listMatch[1], slug)}</li>`);
            return;
        }

        paragraphBuffer.push(trimmed);
    });

    flushParagraph();
    flushList();

    return html.join('');
};

const buildTocFromDocument = (doc: Document, apiToc: InstructionTocItem[]): InstructionTocItem[] => {
    const seenIds = new Set<string>();
    const toc: InstructionTocItem[] = [];
    const headings = Array.from(doc.querySelectorAll('h2, h3'));

    headings.forEach((heading, index) => {
        const level = heading.tagName.toLowerCase() === 'h2' ? 2 : 3;
        const text = heading.textContent?.trim() || `section-${index + 1}`;
        const tocFromApi = apiToc[index];
        const baseId = tocFromApi?.id || heading.id || slugify(text) || `section-${index + 1}`;
        let nextId = baseId;
        let count = 1;

        while (seenIds.has(nextId)) {
            count += 1;
            nextId = `${baseId}-${count}`;
        }

        seenIds.add(nextId);
        heading.id = nextId;
        toc.push({
            id: nextId,
            title: tocFromApi?.title || text,
            level,
        });
    });

    return toc;
};

export const prepareInstructionHtml = (
    article: Pick<InstructionArticle, 'content' | 'contentType' | 'slug' | 'toc'>,
): PreparedInstructionHtml => {
    const { content, contentType, slug, toc: apiToc } = article;

    if (typeof window === 'undefined') {
        return {
            html: content,
            toc: apiToc,
        };
    }

    const sourceHtml = contentType === 'markdown' ? renderMarkdownToHtml(content, slug) : content;
    const parser = new DOMParser();
    const doc = parser.parseFromString(sourceHtml, 'text/html');

    DANGEROUS_TAGS.forEach((tag) => {
        doc.querySelectorAll(tag).forEach((node) => node.remove());
    });

    doc.querySelectorAll('*').forEach(sanitizeNodeAttributes);

    doc.querySelectorAll('img').forEach((image) => {
        const src = image.getAttribute('src');

        if (src) {
            image.setAttribute('src', buildImageProxyUrl(src, slug));
        }
    });

    doc.querySelectorAll('a').forEach((link) => {
        const href = link.getAttribute('href');

        if (href) {
            link.setAttribute('href', normalizeWikiUrl(href, slug));
        }
    });

    doc.querySelectorAll('h1').forEach((heading) => heading.remove());

    const toc = buildTocFromDocument(doc, apiToc);

    return {
        html: doc.body.innerHTML,
        toc,
    };
};
