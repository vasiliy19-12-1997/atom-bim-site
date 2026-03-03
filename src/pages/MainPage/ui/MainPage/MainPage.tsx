import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Page } from '@/shared/ui/redesigned/Page';
import { MainPageHeader } from '../MainPageHeader/MainPageHeader';
import { MainPageModelsSection } from '../MainPageModelsSection/MainPageModelsSection';
import { MainPageSections } from '../MainPageSections/MainPageSections';
import { MainPageVideoSection } from '../MainPageVideoSection/MainPageVideoSection';
import cls from './MainPage.module.scss';

const MainPage = memo(() => {
    const { t } = useTranslation();

    return (
        <Page
            className={cls.MainPage}
            data-testid="MainPage"
        >
            <MainPageHeader />
            <MainPageSections />
            <MainPageVideoSection />
            <MainPageModelsSection />
            <hr />
        </Page>
    );
});

export default MainPage;
