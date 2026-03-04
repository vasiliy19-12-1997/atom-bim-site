export enum VideosFilters {
    VIDEO_INSTRUCTION = 'VIDEO_INSTRUCTION',
    VEBINARS = 'AUTOCAD',
    AUTOCAD = 'AUTOCAD',
    CIVIL3D = 'CIVIL3D',
    REVIT_COMMON = 'REVIT_COMMON',
    REVIT_AR = 'REVIT_AR',
    REVIT_KR = 'REVIT_KR',
    REVIT_OV = 'REVIT_OV',
    REVIT_EL = 'REVIT_EL',
    REVIT_PlUGINS = 'REVIT_PlUGINS',
    PROGRAM_AUTOCAD = 'PROGRAM_AUTOCAD',
    PROGRAM_REVIT = 'PROGRAM_REVIT',
    PROGRAM_TANGL_VALUE = 'PROGRAM_TANGL_VALUE',
}

export enum VideosView {
    BIG = 'BIG',
    SMALL = 'SMALL',
}

export enum VideosSortField {
    RELEVATION = 'RELEVATION',
    SORT_LEARN = 'SORT_LEARN',
}

export enum VideosType {
    ALL = 'ALL',
    INSTRUCTION = 'INSTRUCTION',
    VEBINARS = 'VEBINARS',
    PLUGINS = 'PLUGINS',
}

export interface Videos {
    id: string;
}
