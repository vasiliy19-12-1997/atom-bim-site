export interface EIRSectionBoundary {
    id: string;
    slug: string;
    title: string;
    level: number;
    parentId?: string;
    startIndex: number;
    endIndex: number;
}

export interface EIRNavigationSection extends EIRSectionBoundary {
    isContainer?: boolean;
    children: EIRNavigationSection[];
}
