import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { classNames } from '@/shared/lib/classNames/classNames';
import { Page } from '@/shared/ui/deprecated/Page';
import cls from './AboutPage.module.scss';

const AboutPage = memo(() => {
    const { t } = useTranslation('about');

    const values = [
        {
            title: t('about_values_practical_title'),
            text: t('about_values_practical_text'),
        },
        {
            title: t('about_values_transparent_title'),
            text: t('about_values_transparent_text'),
        },
        {
            title: t('about_values_growth_title'),
            text: t('about_values_growth_text'),
        },
    ];

    const features = [
        t('about_features_1'),
        t('about_features_2'),
        t('about_features_3'),
        t('about_features_4'),
    ];

    return (
        <Page className={cls.AboutPage}>
            <section className={cls.hero}>
                <p className={cls.kicker}>{t('about_kicker')}</p>
                <h1 className={cls.title}>{t('about_title')}</h1>
                <p className={cls.subtitle}>{t('about_subtitle')}</p>
            </section>

            <section className={cls.gridSection}>
                {values.map((item) => (
                    <article key={item.title} className={cls.card}>
                        <h2>{item.title}</h2>
                        <p>{item.text}</p>
                    </article>
                ))}
            </section>

            <section className={cls.infoBlock}>
                <div className={cls.infoHeader}>
                    <h2>{t('about_available_title')}</h2>
                    <p>{t('about_available_text')}</p>
                </div>
                <ul className={cls.featuresList}>
                    {features.map((feature) => (
                        <li key={feature} className={classNames(cls.featureItem)}>
                            {feature}
                        </li>
                    ))}
                </ul>
            </section>

            <section className={cls.cta}>
                <h2>{t('about_cta_title')}</h2>
                <p>{t('about_cta_text')}</p>
            </section>
        </Page>
    );
});

export default AboutPage;
