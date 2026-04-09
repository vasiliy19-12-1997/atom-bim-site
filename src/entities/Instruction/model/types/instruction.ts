export interface InstructionNavNode {
    id: string;
    title: string;
    slug: string;
    type: 'section' | 'article';
    children?: InstructionNavNode[];
}

export interface InstructionBreadcrumb {
    title: string;
    slug: string;
}

export interface InstructionTocItem {
    id: string;
    title: string;
    level: 2 | 3;
}

export interface InstructionArticleItem {
    id: string;
    title: string;
    slug: string;
}

export interface InstructionArticle {
    id: string;
    title: string;
    slug: string;
    kind: 'article' | 'section';
    category: string;
    parentCategory?: string;
    breadcrumbs: InstructionBreadcrumb[];
    content: string;
    contentType: 'html' | 'markdown';
    updatedAt?: string;
    toc: InstructionTocItem[];
    items: InstructionArticleItem[];
}
