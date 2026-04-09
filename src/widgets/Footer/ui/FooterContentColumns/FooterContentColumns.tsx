import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui/redesigned/Button';
import { Icon } from '@/shared/ui/deprecated/Icon';
import { AppLink } from '@/shared/ui/redesigned/AppLink';
import { VStack, HStack } from '@/shared/ui/redesigned/Stack';
import { Text } from '@/shared/ui/redesigned/Text';
import AtomIcon from '@/shared/assets/icons/new/AtomIcon.svg';
import { useFooterItems } from '../../model/selectors/useFooterItems';
import cls from './FooterContentColumns.module.scss';

interface FooterContentColumnsProps {
    className?: string;
}
export const FooterContentColumns = memo((props: FooterContentColumnsProps) => {
    const { className } = props;
    const { t } = useTranslation();
    const footerItemsList = useFooterItems();
    return (
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
                        <Icon
                            className={cls.logoIcon}
                            Svg={AtomIcon}
                        />
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
    );
});
