export interface EIRBreadcrumb {
    title: string;
    slug: string;
}

export interface EIRTocItem {
    id: string;
    title: string;
    level: 1 | 2 | 3;
}

export interface EIRSection {
    id: string;
    title: string;
    level: 1 | 2 | 3;
    html: string;
    children?: EIRSection[];
}

export interface EIRDocumentResponse {
    id: string;
    title: string;
    slug: string;
    breadcrumbs: EIRBreadcrumb[];
    content: string;
    sections: EIRSection[];
    toc: EIRTocItem[];
    updatedAt?: string;
}

export interface EIRDocumentSource {
    filePath: string;
    id: string;
    title: string;
    slug: string;
    breadcrumbs: EIRBreadcrumb[];
}

export interface JsonServerResponse {
    json: (body: unknown) => void;
    status: (code: number) => JsonServerResponse;
}

export interface JsonServerRequest {
    params: Record<string, string | undefined>;
}

export interface JsonServerApp {
    get: (path: string, handler: (req: JsonServerRequest, res: JsonServerResponse) => void | Promise<void>) => void;
}
