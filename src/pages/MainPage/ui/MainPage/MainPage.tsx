import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Page } from '@/shared/ui/redesigned/Page';
import { MainPageHeader } from '../MainPageHeader/MainPageHeader';
import { MainPageSections } from '../MainPageSections/MainPageSections';
import cls from './MainPage.module.scss';
import { Card } from '@/shared/ui/redesigned/Card';
import { HStack, VStack } from '@/shared/ui/redesigned/Stack';
import { Text } from '@/shared/ui/redesigned/Text';
import { MainPageVideoSection } from '../MainPageVideoSection/MainPageVideoSection';
import { AppImage } from '@/shared/ui/redesigned/AppImage';
import { MainPageModelsSection } from '../MainPageModelsSection/MainPageModelsSection';

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
