import { SortOrder } from '@/shared/types';
import { VideosFilters, VideosSortField, VideosType, VideosView } from './videos';

export interface VideosPageSchema {
    isLoading?: boolean;
    error?: string;
    view: VideosView;
    limit: number;
    page: number;
    hasMore: boolean;
    _inited: boolean;
    // filter and sort
    sort: VideosSortField;
    order: SortOrder;
    search: string;
    type: VideosType;
    filter: VideosFilters;
}

//  sort = 'по релевантноси по порядку изучения' , type = 'Инструкции || плагины ||  вебинары', order = 'asc || desc'
