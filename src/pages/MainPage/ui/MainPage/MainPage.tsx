import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Page } from '@/shared/ui/redesigned/Page';
import { MainPageHeader } from '../MainPageHeader/MainPageHeader';
import { MainPageSections } from '../MainPageSections/MainPageSections';
import cls from './MainPage.module.scss';
import { Card } from '@/shared/ui/redesigned/Card';
import { VStack } from '@/shared/ui/redesigned/Stack';
import { Text } from '@/shared/ui/redesigned/Text';

const MainPage = memo(() => {
    const { t } = useTranslation();

    return (
        <Page className={cls.MainPage} data-testid="MainPage">
            <MainPageHeader />
            <MainPageSections />
            <Card className={cls.videoSection}>
                <VStack>
                    <Text title={t('видео о ТИМ департаменте')} />
                    <div className="videoWrapper">
                        <iframe
                            // eslint-disable-next-line max-len
                            src="https://rutube.ru/play/embed/b191fbe1f8ad0f6e3733401faba62c1c"
                            title="Тим департмамент"
                            allow="autoplay"
                        />
                    </div>
                </VStack>
            </Card>
        </Page>
    );
});

export default MainPage;
