import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { classNames } from '@/shared/lib/classNames/classNames';
import cls from './FooterContentLinks.module.scss';
import { AppLink } from '@/shared/ui/redesigned/AppLink';
import { HStack } from '@/shared/ui/redesigned/Stack';
import { Text } from '@/shared/ui/redesigned/Text';

interface FooterContentLinksProps {
    className?: string;
}

export const FooterContentLinks = memo((props: FooterContentLinksProps) => {
    const { t } = useTranslation();
    const { className } = props;

    return (
        <>
            <div className={cls.divider} />
            <Text
                className={cls.legal}
                size="s"
                text={t(
                    `Любые материалы, файлы и сервисы, содержащиеся на сайте, не могут быть воспроизведены полностью или частично без предварительного письменного разрешения компании, 
                        за исключением случаев, предусмотренных правилами использования сайта.`,
                )}
            />
            <HStack
                max
                justify="between"
                wrap="wrap"
                className={cls.bottom}
            >
                <Text
                    text={t('© АО «Корпорация «АТОМСТРОЙКОМПЛЕКС», 2024')}
                    size="s"
                    className={cls.bottomText}
                />

                <HStack
                    gap={24}
                    wrap="wrap"
                    className={cls.bottomNav}
                >
                    <AppLink
                        size="s"
                        target="_blank"
                        to="https://atom-bim.ru/Docum/%D0%A1%D0%BE%D0%B3%D0%BB%D0%B0%D1%88%D0%B5%D0%BD%D0%B8%D0%B5_%D0%BE%D0%B1_%D0%B8%D1%81%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B8%20%D1%81%D0%B0%D0%B9%D1%82%D0%B0.pdf"
                        className={cls.bottomLink}
                    >
                        {t('Соглашение')}
                    </AppLink>

                    <AppLink
                        size="s"
                        target="_blank"
                        to="https://atom-bim.ru/Docum/%D0%A1%D0%BE%D0%B3%D0%BB%D0%B0%D1%88%D0%B5%D0%BD%D0%B8%D0%B5_%D0%BE%D0%B1_%D0%B8%D1%81%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B8%20%D1%81%D0%B0%D0%B9%D1%82%D0%B0.pdf"
                        className={cls.bottomLink}
                    >
                        {t('Политика данных')}
                    </AppLink>

                    <AppLink
                        size="s"
                        target="_blank"
                        to="https://atom-bim.ru/"
                        className={cls.bottomLink}
                    >
                        {t('atom-bim.ru')}
                    </AppLink>
                </HStack>
            </HStack>
        </>
    );
});
