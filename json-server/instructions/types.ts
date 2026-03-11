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

export interface InstructionDataSource {
    tree: InstructionNavNode[];
    articles: InstructionArticle[];
}

export interface JsonServerResponse {
    json: (body: unknown) => void;
    status: (code: number) => JsonServerResponse;
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
    html?: string;
    body?: {
        html?: string;
    } | string;
    path?: string;
    updatedAt?: string;
    modifiedAt?: string;
    updated_at?: string;
}
