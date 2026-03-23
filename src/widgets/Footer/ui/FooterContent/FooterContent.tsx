import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { classNames } from '@/shared/lib/classNames/classNames';
import { Icon } from '@/shared/ui/redesigned/Icon';
import { AppLink } from '@/shared/ui/redesigned/AppLink';
import { HStack, VStack } from '@/shared/ui/redesigned/Stack';
import { useFooterItems } from '../../model/selectors/useFooterItems';
import cls from './FooterContent.module.scss';
import { Text } from '@/shared/ui/redesigned/Text';
import AtomIcon from '@/shared/assets/icons/new/AtomIcon.svg';

interface FooterContentProps {
    className?: string;
}

const legalLinks = [
    {
        to: 'https://atom-bim.ru/Docum/%D0%A1%D0%BE%D0%B3%D0%BB%D0%B0%D1%88%D0%B5%D0%BD%D0%B8%D0%B5_%D0%BE%D0%B1_%D0%B8%D1%81%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B8%20%D1%81%D0%B0%D0%B9%D1%82%D0%B0.pdf',
        text: 'Соглашение',
    },
    {
        to: 'https://atom-bim.ru/Docum/%D0%A1%D0%BE%D0%B3%D0%BB%D0%B0%D1%88%D0%B5%D0%BD%D0%B8%D0%B5_%D0%BE%D0%B1_%D0%B8%D1%81%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B8%20%D1%81%D0%B0%D0%B9%D1%82%D0%B0.pdf',
        text: 'Политика данных',
    },
];

export const FooterContent = memo((props: FooterContentProps) => {
    const { t } = useTranslation();
    const { className } = props;
    const footerItemsList = useFooterItems();
    const navigationItems = footerItemsList.filter((item) => !item.Icon);
    const companyLink = footerItemsList.find((item) => item.Icon);

    return (
        <footer className={classNames(cls.FooterContent, {}, [className])}>
            <div className={cls.container}>
                <div className={cls.surface}>
                    <div className={cls.topRow}>
                        <VStack
                            gap={16}
                            className={cls.brandColumn}
                        >
                            <HStack
                                gap={16}
                                className={cls.brandHead}
                            >
                                <div className={cls.logoBox}>
                                    <Icon Svg={AtomIcon} />
                                </div>
                                <Text
                                    title={t('ATOM.BIM')}
                                    text={t('BIM-стандарты, инструкции и библиотека знаний в одном окне.')}
                                    size="m"
                                    bold
                                    className={cls.brandText}
                                />
                            </HStack>

                            <Text
                                text={t(
                                    'Главная площадка для навигации по EIR, инструкциям, видеоматериалам, библиотеке и внутренним тестам команды.',
                                )}
                                size="s"
                                className={cls.brandDescription}
                            />
                        </VStack>

                        <VStack
                            gap={16}
                            className={cls.linksColumn}
                        >
                            <Text
                                title={t('Быстрые переходы')}
                                size="s"
                                bold
                                className={cls.columnTitle}
                            />

                            <HStack
                                gap={16}
                                wrap="wrap"
                                className={cls.quickLinks}
                            >
                                {navigationItems.map((item) => (
                                    <AppLink
                                        key={item.path}
                                        to={item.path}
                                        className={cls.quickLink}
                                    >
                                        <Text
                                            text={t(item.text)}
                                            size="s"
                                            className={cls.quickLinkText}
                                        />
                                    </AppLink>
                                ))}
                            </HStack>
                        </VStack>

                        <VStack
                            gap={16}
                            className={cls.contactsColumn}
                        >
                            <Text
                                title={t('Контакты')}
                                size="s"
                                bold
                                className={cls.columnTitle}
                            />
                            <Text
                                text={t('Екатеринбург, ул. Белинского, 39')}
                                size="s"
                                className={cls.contactText}
                            />
                            <Text
                                text={t('АО «Корпорация «АТОМСТРОЙКОМПЛЕКС»')}
                                size="s"
                                className={cls.contactText}
                            />
                            {companyLink && (
                                <AppLink
                                    target="_blank"
                                    to={companyLink.path}
                                    className={cls.companyLink}
                                >
                                    <HStack gap={8}>
                                        <Text
                                            text={t(companyLink.text)}
                                            size="s"
                                            bold
                                            variant="accent"
                                        />
                                        {companyLink.Icon && (
                                            <Icon
                                                Svg={companyLink.Icon}
                                                className={cls.linkIcon}
                                            />
                                        )}
                                    </HStack>
                                </AppLink>
                            )}
                        </VStack>
                    </div>

                    <div className={cls.divider} />

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
                            {legalLinks.map((item) => (
                                <AppLink
                                    key={item.text}
                                    target="_blank"
                                    to={item.to}
                                    className={cls.bottomLink}
                                >
                                    <Text
                                        text={t(item.text)}
                                        size="s"
                                        className={cls.bottomLinkText}
                                    />
                                </AppLink>
                            ))}
                        </HStack>
                    </HStack>
                </div>
            </div>
        </footer>
    );
});
