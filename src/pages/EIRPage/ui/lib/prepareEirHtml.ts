import { EIRTocItem } from '@/entities/EIR';

interface PreparedEirHtml {
    html: string;
    toc: EIRTocItem[];
}

const DANGEROUS_TAGS = ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'textarea'];
const SCRIPT_PROTOCOL = /^java[\s]*script:/i;

const slugify = (value: string) =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^\w\u0400-\u04ff\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

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

export const prepareEirHtml = (content: string, apiToc: EIRTocItem[]): PreparedEirHtml => {
    if (typeof window === 'undefined') {
        return {
            html: content,
            toc: apiToc,
        };
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');

    DANGEROUS_TAGS.forEach((tag) => {
        doc.querySelectorAll(tag).forEach((node) => node.remove());
    });

    doc.querySelectorAll('*').forEach(sanitizeNodeAttributes);

    const seenIds = new Set<string>();
    const toc: EIRTocItem[] = [];
    const headings = Array.from(doc.querySelectorAll('h1, h2, h3'));

    headings.forEach((heading, index) => {
        const level = Number(heading.tagName.substring(1)) as 1 | 2 | 3;
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

    return {
        html: doc.body.innerHTML,
        toc,
    };
};
