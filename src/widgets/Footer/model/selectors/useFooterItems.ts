import { useSelector } from 'react-redux';
import { getAuthUserData } from '@/entities/User';
import {
    getRouteEir,
    getRouteInstruction,
    getRouteLibrary,
    getRouteTests,
    getRouteVideos,
} from '@/shared/const/router';
import { FooterItemProps } from '../types/footer';
import AtomSiteIcon from '@/shared/assets/icons/new/Link 24px.svg';

export const useFooterItems = () => {
    const userData = useSelector(getAuthUserData);
    const FooterItemsList: FooterItemProps[] = [
        {
            path: 'https://www.atomstroy.net/',
            text: 'Сайт компании',
            Icon: AtomSiteIcon,
        },
    ];
    if (userData) {
        FooterItemsList.push(
            {
                path: getRouteEir(),
                text: 'EIR',
                authOnly: true,
            },
            {
                path: getRouteInstruction(),
                text: 'Инструкции',
                authOnly: true,
            },
            {
                path: getRouteVideos(),
                text: 'Видеоматериалы',
                authOnly: true,
            },
            {
                path: getRouteLibrary(),
                text: 'Библиотека',
                authOnly: true,
            },
            {
                path: getRouteTests(),
                text: 'Тесты',
                authOnly: true,
            },
        );
    }
    return FooterItemsList;
};
