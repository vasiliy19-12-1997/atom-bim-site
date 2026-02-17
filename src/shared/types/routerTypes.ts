import { RouteProps } from 'react-router-dom';
// eslint-disable-next-line atom-bim-site-plugin/layer-imports
import { UserRoles } from '@/entities/User';

export type AppRouteProps = RouteProps & {
    authOnly?: boolean;
    roles?: UserRoles[];
};
