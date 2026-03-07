import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { classNames } from '@/shared/lib/classNames/classNames';
import { Button } from '@/shared/ui/redesigned/Button';
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

export const FooterContent = memo((props: FooterContentProps) => {
    const { t } = useTranslation();
    const { className } = props;
    const footerItemsList = useFooterItems();

    return (
        <footer className={classNames(cls.FooterContent, {}, [className])}>
            <div className={cls.glow} />

            <div className={cls.container}>
                <div className={cls.grid}>
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

                            <VStack gap={4}>
                                <Text
                                    title={t('ATOM.BIM')}
                                    size="m"
                                    bold
                                />
                                <Text
                                    text={t('Цифровая среда для BIM-стандартов, инструкций и базы знаний.')}
                                    size="s"
                                    className={cls.muted}
                                />
                            </VStack>
                        </HStack>

                        <Text
                            text={t(
                                'Платформа объединяет требования, библиотеку материалов, этапы моделирования, инструкции и обучающие материалы для BIM-команды.',
                            )}
                            size="s"
                            className={cls.description}
                        />

                        <HStack
                            gap={16}
                            wrap="wrap"
                            className={cls.badges}
                        >
                            <span className={cls.badge}>BIM</span>
                            <span className={cls.badge}>EIR</span>
                            <span className={cls.badge}>24/7</span>
                        </HStack>
                    </VStack>

                    <VStack
                        gap={16}
                        className={cls.column}
                    >
                        <Text
                            title={t('Разделы')}
                            size="m"
                            bold
                        />

                        <VStack
                            gap={16}
                            className={cls.linkList}
                        >
                            {footerItemsList.map((item) => (
                                <AppLink
                                    key={item.path}
                                    to={item.path}
                                    className={cls.footerLink}
                                >
                                    <HStack gap={8}>
                                        <span>{t(item.text)}</span>
                                        {item.Icon && (
                                            <Icon
                                                Svg={item.Icon}
                                                className={cls.linkIcon}
                                            />
                                        )}
                                    </HStack>
                                </AppLink>
                            ))}
                        </VStack>
                    </VStack>

                    <VStack
                        gap={16}
                        className={cls.column}
                    >
                        <Text
                            title={t('Документы')}
                            size="m"
                            bold
                        />

                        <VStack
                            gap={16}
                            className={cls.linkList}
                        >
                            <AppLink
                                target="_blank"
                                to="https://atom-bim.ru/Docum/%D0%A1%D0%BE%D0%B3%D0%BB%D0%B0%D1%88%D0%B5%D0%BD%D0%B8%D0%B5_%D0%BE%D0%B1_%D0%B8%D1%81%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B8%20%D1%81%D0%B0%D0%B9%D1%82%D0%B0.pdf"
                                className={cls.footerLink}
                            >
                                {t('Соглашение об использовании сайта')}
                            </AppLink>

                            <AppLink
                                target="_blank"
                                to="https://atom-bim.ru/Docum/%D0%A1%D0%BE%D0%B3%D0%BB%D0%B0%D1%88%D0%B5%D0%BD%D0%B8%D0%B5_%D0%BE%D0%B1_%D0%B8%D1%81%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B8%20%D1%81%D0%B0%D0%B9%D1%82%D0%B0.pdf"
                                className={cls.footerLink}
                            >
                                {t('Политика обработки персональных данных')}
                            </AppLink>

                            <AppLink
                                target="_blank"
                                to="https://atom-bim.ru/"
                                className={cls.footerLink}
                            >
                                {t('Официальный сайт')}
                            </AppLink>
                        </VStack>
                    </VStack>

                    <VStack
                        gap={16}
                        className={cls.column}
                    >
                        <Text
                            title={t('Контакты')}
                            size="m"
                            bold
                        />

                        <VStack gap={16}>
                            <Text
                                text={t('Екатеринбург, ул. Белинского, 39')}
                                size="s"
                                className={cls.muted}
                            />
                            <Text
                                text={t('АО «Корпорация «АТОМСТРОЙКОМПЛЕКС»')}
                                size="s"
                                className={cls.muted}
                            />
                        </VStack>

                        <AppLink
                            target="_blank"
                            to="https://atom-bim.ru/"
                        >
                            <Button variant="outline">{t('Перейти на сайт компании')}</Button>
                        </AppLink>
                    </VStack>
                </div>

                <div className={cls.divider} />

                <Text
                    className={cls.legal}
                    text={t(
                        'Любые материалы, файлы и сервисы, содержащиеся на сайте, не могут быть воспроизведены полностью или частично без предварительного письменного разрешения компании, за исключением случаев, предусмотренных правилами использования сайта.',
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
                            target="_blank"
                            to="https://atom-bim.ru/Docum/%D0%A1%D0%BE%D0%B3%D0%BB%D0%B0%D1%88%D0%B5%D0%BD%D0%B8%D0%B5_%D0%BE%D0%B1_%D0%B8%D1%81%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B8%20%D1%81%D0%B0%D0%B9%D1%82%D0%B0.pdf"
                            className={cls.bottomLink}
                        >
                            {t('Соглашение')}
                        </AppLink>

                        <AppLink
                            target="_blank"
                            to="https://atom-bim.ru/Docum/%D0%A1%D0%BE%D0%B3%D0%BB%D0%B0%D1%88%D0%B5%D0%BD%D0%B8%D0%B5_%D0%BE%D0%B1_%D0%B8%D1%81%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B8%20%D1%81%D0%B0%D0%B9%D1%82%D0%B0.pdf"
                            className={cls.bottomLink}
                        >
                            {t('Политика данных')}
                        </AppLink>

                        <AppLink
                            target="_blank"
                            to="https://atom-bim.ru/"
                            className={cls.bottomLink}
                        >
                            {t('atom-bim.ru')}
                        </AppLink>
                    </HStack>
                </HStack>
            </div>
        </footer>
    );
});
