import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Page } from '@/shared/ui/deprecated/Page';
import { MainPageHeader } from '../MainPageHeader/MainPageHeader';

const MainPage = memo(() => {
    const { t } = useTranslation();

    return (
        <Page data-testid="MainPage">
            <MainPageHeader />
        </Page>
    );
});

export default MainPage;
