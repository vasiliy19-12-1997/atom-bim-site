import { EIRTocItem } from '@/entities/EIR';

interface PreparedEirHtml {
    html: string;
    toc: EIRTocItem[];
}

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

const DANGEROUS_TAGS = ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'textarea'];
const SCRIPT_PROTOCOL = /^java[\s]*script:/i;
const PAGE_NUMBER_SUFFIX_REGEX = /\s+\d+\s*$/;

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

const normalizeHeadingLevel = (rawLevel: HeadingLevel, baseLevel: HeadingLevel): 1 | 2 | 3 => {
    const normalized = rawLevel - baseLevel + 1;

    if (normalized <= 1) {
        return 1;
    }

    if (normalized >= 3) {
        return 3;
    }

    return normalized as 1 | 2 | 3;
};

const clampTocLevel = (level: number): 1 | 2 | 3 => {
    if (level <= 1) {
        return 1;
    }

    if (level >= 3) {
        return 3;
    }

    return level as 1 | 2 | 3;
};

const normalizeTextContent = (value: string): string => value
    .replace(/\s+/g, ' ')
    .replace(PAGE_NUMBER_SUFFIX_REGEX, '')
    .trim();

const getOwnTextContent = (element: Element): string => {
    const clone = element.cloneNode(true) as Element;

    clone.querySelectorAll('ol, ul').forEach((list) => list.remove());
    clone.querySelectorAll('a').forEach((anchor) => {
        const text = normalizeTextContent(anchor.textContent || '');

        if (text) {
            anchor.replaceWith(clone.ownerDocument.createTextNode(text));
            return;
        }

        anchor.remove();
    });

    return normalizeTextContent(clone.textContent || '');
};

const getListItemLevel = (listItem: HTMLLIElement): 1 | 2 | 3 => {
    let depth = 0;
    let current = listItem.parentElement;

    while (current) {
        if (current.tagName === 'OL' || current.tagName === 'UL') {
            depth += 1;
        }
        current = current.parentElement;
    }

    return clampTocLevel(depth || 1);
};

const extractTocFromListAnchors = (doc: Document): EIRTocItem[] => {
    const toc: EIRTocItem[] = [];
    const seenIds = new Set<string>();
    const listItems = Array.from(doc.querySelectorAll('li'));

    listItems.forEach((listItem) => {
        const anchors = Array.from(listItem.querySelectorAll('a[id^="_Toc"]'))
            .filter((anchor) => anchor.closest('li') === listItem);

        if (!anchors.length) {
            return;
        }

        const selectedAnchor = anchors[anchors.length - 1];
        const id = selectedAnchor.getAttribute('id');
        const title = getOwnTextContent(listItem);

        if (!id || !title || seenIds.has(id)) {
            return;
        }

        listItem.id = id;
        anchors.forEach((anchor) => anchor.removeAttribute('id'));

        seenIds.add(id);
        toc.push({
            id,
            title,
            level: getListItemLevel(listItem),
        });
    });

    return toc;
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
    doc.querySelectorAll('img').forEach((image) => {
        if (!image.getAttribute('loading')) {
            image.setAttribute('loading', 'lazy');
        }
    });

    const seenIds = new Set<string>();
    let toc: EIRTocItem[] = [];
    const headings = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6'));

    if (headings.length) {
        const headingLevels = headings.map((heading) => Number(heading.tagName.substring(1)) as HeadingLevel);
        const baseLevel = (Math.min(...headingLevels) as HeadingLevel) || 1;

        headings.forEach((heading, index) => {
            const rawLevel = Number(heading.tagName.substring(1)) as HeadingLevel;
            const level = normalizeHeadingLevel(rawLevel, baseLevel);
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
    } else {
        toc = extractTocFromListAnchors(doc);
    }

    return {
        html: doc.body.innerHTML,
        toc,
    };
};
