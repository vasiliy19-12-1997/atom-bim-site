import { useSelector } from 'react-redux';
import { getAuthUserData } from '@/entities/User';
import ArticleIcon from '@/shared/assets/icons/article.svg';
import EIRIcon from '@/shared/assets/icons/new/Information 24px.svg';
import ProfileIcon from '@/shared/assets/icons/avatar.svg';
import MainIcon from '@/shared/assets/icons/home.svg';
import AboutIcon from '@/shared/assets/icons/Info.svg';
import {
    getRouteAbout,
    getRouteArticle,
    getRouteEir,
    getRouteInstruction,
    getRouteLibrary,
    getRouteMain,
    getRouteProfile,
    getRouteTests,
    getRouteVideos,
} from '@/shared/const/router';
import { SidebarItemType } from '../types/sidebar';

export const useSidebarItems = () => {
    const userData = useSelector(getAuthUserData);
    const SidebarItemsList: SidebarItemType[] = [
        {
            path: getRouteMain(),
            Icon: MainIcon,
            text: 'Главная',
        },
        {
            path: getRouteAbout(),
            Icon: AboutIcon,
            text: 'О сайте',
        },
    ];
    if (userData) {
        SidebarItemsList.push(
            {
                path: getRouteProfile(userData.id),
                Icon: ProfileIcon,
                text: 'Профиль',
                authOnly: true,
            },
            {
                path: getRouteArticle(),
                Icon: ArticleIcon,
                text: 'Article',
                authOnly: true,
            },
            {
                path: getRouteEir(),
                Icon: EIRIcon,
                text: 'EIR',
                authOnly: true,
            },
            {
                path: getRouteInstruction(),
                Icon: EIRIcon,
                text: 'Инструкции',
                authOnly: true,
            },
            {
                path: getRouteVideos(),
                Icon: EIRIcon,
                text: 'Видео',
                authOnly: true,
            },
            {
                path: getRouteLibrary(),
                Icon: EIRIcon,
                text: 'Библиотека',
                authOnly: true,
            },
            {
                path: getRouteTests(),
                Icon: EIRIcon,
                text: 'Тесты',
                authOnly: true,
            },
        );
    }
    return SidebarItemsList;
};
