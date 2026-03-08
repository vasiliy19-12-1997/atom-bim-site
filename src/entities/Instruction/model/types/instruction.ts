export interface InstructionNavNode {
    id: string;
    title: string;
    slug: string;
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

export interface InstructionArticle {
    id: string;
    title: string;
    slug: string;
    category: string;
    parentCategory?: string;
    breadcrumbs: InstructionBreadcrumb[];
    content: string;
    contentType: 'html';
    updatedAt?: string;
    toc: InstructionTocItem[];
}
