export interface VideoDto {
    id: string;
    title: string;
    link: string;
    type: 'VIDEO_INSTRUCTION' | 'WEBINARS' | 'PLUGINS';
    section: 'COMMON' | 'AR' | 'KR' | 'OV' | 'VK' | 'EL';
    software: 'AUTOCAD' | 'REVIT' | 'TANGL_VALUE' | 'CIVIL3D';
}

export type RutubeCard = {
    id?: string | number;
    title?: string;
    video_url?: string;
    embed_url?: string;
    absolute_url?: string;
    category?: string;
};

export type RutubePlaylist = {
    id?: string | number;
    title?: string;
    name?: string;
    videos?: Array<{ id?: string | number } | string | number>;
    video_ids?: Array<string | number>;
    videos_url?: string;
    video_url?: string;
    api_url?: string;
    absolute_url?: string;
};

export type RutubeListResponse<T> = {
    results?: T[];
    next?: string | null;
};

export type JsonServerRequest = {
    query: Record<string, string | string[] | undefined>;
};

export type JsonServerResponse = {
    json: (body: unknown) => void;
    status: (code: number) => JsonServerResponse;
};

export type JsonServerApp = {
    get: (path: string, handler: (req: JsonServerRequest, res: JsonServerResponse) => Promise<void> | void) => void;
};
