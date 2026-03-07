export enum VideoMainSections {
    COMMON = 'COMMON',
    AR = 'AR',
    KR = 'KR',
    OV = 'OV',
    VK = 'VK',
    EL = 'EL',
}

export enum VideoSoftware {
    AUTOCAD = 'AUTOCAD',
    REVIT = 'REVIT',
    TANGL_VALUE = 'TANGL_VALUE',
    CIVIL3D = 'CIVIL3D',
}

export enum VideoSortField {
    RELEVATION = 'title',
    SORT_LEARN = 'id',
}

export enum VideoType {
    VIDEO_INSTRUCTION = 'VIDEO_INSTRUCTION',
    WEBINARS = 'WEBINARS',
    PLUGINS = 'PLUGINS',
    ALL = 'ALL',
}

export interface Video {
    id: string;
    title: string;
    link: string;
    type: VideoType;
    section: VideoMainSections;
    software: VideoSoftware;
}
