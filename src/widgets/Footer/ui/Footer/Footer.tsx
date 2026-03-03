import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { classNames } from '@/shared/lib/classNames/classNames';
import cls from './Footer.module.scss';
import { HStack, VStack } from '@/shared/ui/redesigned/Stack';
import { AppLink } from '@/shared/ui/redesigned/AppLink';
import { useFooterItems } from '../../model/selectors/getFooterItems';
import { Button } from '@/shared/ui/redesigned/Button';
import { Card } from '@/shared/ui/redesigned/Card';
import { Icon } from '@/shared/ui/redesigned/Icon';
import AtomIcon from '@/shared/assets/icons/new/AtomIcon.svg';
import { Text } from '@/shared/ui/redesigned/Text';
interface FooterProps {
    className?: string;
}

export const Footer = memo((props: FooterProps) => {
    const { t } = useTranslation();
    const { className } = props;
    const footerItemsList = useFooterItems();

    return (
        <Card
            className={classNames(cls.Footer, {}, [className])}
            max
            padding="24"
        >
            <VStack justify="between">
                <HStack
                    max
                    justify="between"
                >
                    {footerItemsList.map((item) => (
                        <AppLink
                            key={item.path}
                            to={item.path}
                            target="blanc"
                        >
                            {item.Icon ? (
                                <Button variant="clear">
                                    {t(item.text)}
                                    <Icon Svg={item.Icon} />
                                </Button>
                            ) : (
                                <Button variant="clear">{t(item.text)}</Button>
                            )}
                        </AppLink>
                    ))}
                </HStack>
                <HStack
                    justify="between"
                    max
                >
                    <Text
                        text={t('© АО «Корпорация «АТОМСТРОЙКОМПЛЕКС», 2024')}
                        className={cls.copyright}
                    />
                    <Icon Svg={AtomIcon} />
                    <Text
                        text={t('Екатеринбург, ул. Белинского, 39')}
                        className={cls.developer}
                    />
                </HStack>
                <Text
                    text={t(`Любые материалы, файлы и сервисы, содержащиеся на сайте, не могут быть воспроизведены в какой-либо форме, каким-либо способом, полностью или частично без предварительного письменного
разрешения Компании, за исключением случаев, указанных в Соглашении об использовании сайта.`)}
                />
                <HStack
                    max
                    justify="between"
                >
                    <AppLink
                        target="_blank"
                        to={
                            'https://atom-bim.ru/Docum/%D0%A1%D0%BE%D0%B3%D0%BB%D0%B0%D1%88%D0%B5%D0%BD%D0%B8%D0%B5_%D0%BE%D0%B1_%D0%B8%D1%81%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B8%20%D1%81%D0%B0%D0%B9%D1%82%D0%B0.pdf'
                        }
                    >
                        <Button variant="clear">{t('Соглашение об использовании сайта')}</Button>
                    </AppLink>
                    <AppLink
                        target="_blank"
                        to={
                            'https://atom-bim.ru/Docum/%D0%A1%D0%BE%D0%B3%D0%BB%D0%B0%D1%88%D0%B5%D0%BD%D0%B8%D0%B5_%D0%BE%D0%B1_%D0%B8%D1%81%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B8%20%D1%81%D0%B0%D0%B9%D1%82%D0%B0.pdf'
                        }
                    >
                        <Button variant="clear">{t('Политика в отношении обработки персональных данных')}</Button>
                    </AppLink>
                </HStack>
            </VStack>
        </Card>
    );
});
