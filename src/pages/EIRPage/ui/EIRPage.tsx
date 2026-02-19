import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Page } from '@/shared/ui/deprecated/Page';

const AboutPage = memo(() => {
    const { t } = useTranslation('about');

    return <Page>{t('Eir page')}</Page>;
});

export default AboutPage;
