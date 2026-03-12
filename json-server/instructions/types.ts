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

export interface InstructionDataSource {
    tree: InstructionNavNode[];
    articles: InstructionArticle[];
}

export interface JsonServerResponse {
    json: (body: unknown) => void;
    status: (code: number) => JsonServerResponse;
    setHeader: (name: string, value: string | number | readonly string[]) => void;
    send: (body: unknown) => void;
}

export interface JsonServerRequest {
    params: Record<string, string | undefined>;
    query?: Record<string, string | undefined>;
    headers?: Record<string, string | undefined>;
}

export interface JsonServerApp {
    get: (path: string, handler: (req: JsonServerRequest, res: JsonServerResponse) => void | Promise<void>) => void;
}

export interface WikiPageDto {
    id?: string | number;
    slug?: string;
    supertag?: string;
    title?: string;
    heading?: string;
    page_type?: 'page' | 'grid' | 'cloud_page' | 'wysiwyg' | 'template' | string;
    parent?: {
        id?: string | number;
        slug?: string;
        supertag?: string;
        title?: string;
        heading?: string;
    };
    breadcrumbs?: Array<{
        title?: string;
        slug?: string;
        supertag?: string;
    }>;
    children?: WikiPageDto[];
    subpages?: WikiPageDto[];
    pages?: WikiPageDto[];
    items?: WikiPageDto[];
    results?: WikiPageDto[];
    content?: string | {
        html?: string;
        [key: string]: unknown;
    };
    html?: string;
    body?: {
        html?: string;
    } | string;
    attributes?: {
        created_at?: string;
        modified_at?: string;
        [key: string]: unknown;
    };
    path?: string;
    updatedAt?: string;
    modifiedAt?: string;
    updated_at?: string;
}

export interface WikiFileDto {
    body: Buffer;
    contentType: string;
    contentLength?: string;
    cacheControl?: string;
    fileName?: string;
}
