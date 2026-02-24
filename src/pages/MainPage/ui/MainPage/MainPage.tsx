import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Page } from '@/shared/ui/redesigned/Page';
import { MainPageHeader } from '../MainPageHeader/MainPageHeader';
import { MainPageSections } from '../MainPageSections/MainPageSections';
import cls from './MainPage.module.scss';

const MainPage = memo(() => {
    const { t } = useTranslation();

    return (
        <Page className={cls.MainPage} data-testid="MainPage">
            <MainPageHeader />
            <MainPageSections />
        </Page>
    );
});

export default MainPage;
