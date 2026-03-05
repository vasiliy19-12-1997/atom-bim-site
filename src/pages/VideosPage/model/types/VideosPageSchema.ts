import { VideoSortField, VideoType } from '@/entities/Video';
import { SortOrder, View } from '@/shared/types';

export interface VideosPageSchema {
    isLoading?: boolean;
    error?: string;
    view: View;
    limit?: number;
    page: number;
    hasMore: boolean;
    _inited: boolean;
    // filter and sort
    sort: VideoSortField;
    order: SortOrder;
    search: string;
    type: VideoType;
    filter: VideoFilters;
}

//  sort = 'по релевантноси по порядку изучения' , type = 'Инструкции || плагины ||  вебинары', order = 'asc || desc'
