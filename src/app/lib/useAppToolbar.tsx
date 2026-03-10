import { ReactElement } from 'react';
import { AppRoutes } from '@/shared/const/router';
import { ScrollToolbar } from '@/widgets/ScrollToolbar';
import { useRouteChange } from '@/shared/lib/router/useRouteChange';

export const useAppToolbar = () => {
    const appRoute = useRouteChange();

    const toolbarByAppRoutes: OptionalRecord<AppRoutes, ReactElement> = {
        [AppRoutes.ARTICLE]: <ScrollToolbar />,
        [AppRoutes.ARTICLE_DETAILS]: <ScrollToolbar />,
        [AppRoutes.MAIN]: <ScrollToolbar />,
        [AppRoutes.EIR]: <ScrollToolbar />,
        [AppRoutes.INSTRUCTION]: <ScrollToolbar />,
        [AppRoutes.VIDEOS]: <ScrollToolbar />,
    };
    return toolbarByAppRoutes[appRoute];
};
