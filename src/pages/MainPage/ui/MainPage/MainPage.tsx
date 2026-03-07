import { memo } from 'react';
import { Page } from '@/shared/ui/redesigned/Page';
import { MainPageHeader } from '../MainPageHeader/MainPageHeader';
import { MainPageModelsSection } from '../MainPageModelsSection/MainPageModelsSection';
import { MainPageSections } from '../MainPageSections/MainPageSections';
import { MainPageVideoSection } from '../MainPageVideoSection/MainPageVideoSection';
import cls from './MainPage.module.scss';

const MainPage = memo(() => {
    return (
        <Page
            className={cls.MainPage}
            data-testid="MainPage"
        >
            <div className={cls.content}>
                <MainPageHeader />
                <MainPageSections />
                <MainPageVideoSection />
                <MainPageModelsSection />
                <hr className={cls.divider} />
            </div>
        </Page>
    );
});

export default MainPage;
