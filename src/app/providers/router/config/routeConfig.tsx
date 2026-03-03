import { UserRoles } from '@/entities/User';
import { AboutPage } from '@/pages/AboutPage';
import { AdminPanelPage } from '@/pages/AdminPanelPage';
import { ArticleEditPage } from '@/pages/ArticleEditPage';
import { ArticlePage } from '@/pages/ArticlePage';
import { ArticlePageDetails } from '@/pages/ArticlePageDetails';
import { EIRPage } from '@/pages/EIRPage';
import { ForbiddenPage } from '@/pages/ForbiddenPage';
import { InstructionPage } from '@/pages/InstructionPage';
import { LibraryPage } from '@/pages/LibraryPage';
import { MainPage } from '@/pages/MainPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { SettingsPage } from '@/pages/SettingsPage';
import { TestsPage } from '@/pages/TestsPage';
import { VideosPage } from '@/pages/VideosPage';
import {
    AppRoutes,
    getRouteAbout,
    getRouteAdmin,
    getRouteArticle,
    getRouteArticleCreate,
    getRouteArticleDetails,
    getRouteArticleEdit,
    getRouteEir,
    getRouteForbidden,
    getRouteInstruction,
    getRouteLibrary,
    getRouteMain,
    getRouteProfile,
    getRouteSettings,
    getRouteTests,
    getRouteVideos,
} from '@/shared/const/router';
import { AppRouteProps } from '@/shared/types/routerTypes';

export const routeConfig: Record<AppRoutes, AppRouteProps> = {
    [AppRoutes.MAIN]: {
        path: getRouteMain(),
        element: <MainPage />,
    },
    [AppRoutes.ABOUT]: {
        path: getRouteAbout(),
        element: <AboutPage />,
    },
    [AppRoutes.PROFILE]: {
        path: getRouteProfile(':id'),
        element: <ProfilePage />,
        authOnly: true,
    },
    [AppRoutes.ARTICLE]: {
        path: getRouteArticle(),
        element: <ArticlePage />,
        authOnly: true,
    },
    [AppRoutes.ARTICLE_DETAILS]: {
        path: getRouteArticleDetails(':id'),
        element: <ArticlePageDetails />,
        authOnly: true,
    },
    [AppRoutes.ARTICLE_CREATE]: {
        path: getRouteArticleCreate(),
        element: <ArticleEditPage />,
        authOnly: true,
    },
    [AppRoutes.ARTICLE_EDIT]: {
        path: getRouteArticleEdit(':id'),
        element: <ArticleEditPage />,
        authOnly: true,
    },
    [AppRoutes.ADMIN]: {
        path: getRouteAdmin(),
        element: <AdminPanelPage />,
        authOnly: true,
        roles: [UserRoles.ADMIN, UserRoles.MANAGER],
    },
    [AppRoutes.FORBIDDEN]: {
        path: getRouteForbidden(),
        element: <ForbiddenPage />,
    },
    [AppRoutes.NOT_FOUND]: {
        path: '*',
        element: <NotFoundPage />,
    },
    [AppRoutes.SETTINGS]: {
        path: getRouteSettings(),
        element: <SettingsPage />,
        roles: [UserRoles.ADMIN, UserRoles.MANAGER],
    },
    [AppRoutes.EIR]: {
        path: getRouteEir(),
        element: <EIRPage />,
        authOnly: true,
    },
    [AppRoutes.INSTRUCTION]: {
        path: getRouteInstruction(),
        element: <InstructionPage />,
        authOnly: true,
    },
    [AppRoutes.VIDEOS]: {
        path: getRouteVideos(),
        element: <VideosPage />,
        authOnly: true,
    },
    [AppRoutes.LIBRARY]: {
        path: getRouteLibrary(),
        element: <LibraryPage />,
        authOnly: true,
    },
    [AppRoutes.TESTS]: {
        path: getRouteTests(),
        element: <TestsPage />,
        authOnly: true,
    },
};
