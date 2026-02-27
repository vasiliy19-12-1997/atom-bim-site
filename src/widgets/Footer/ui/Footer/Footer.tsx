import { classNames } from '@/shared/lib/classNames/classNames';
import cls from './Footer.module.scss';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { HStack, VStack } from '@/shared/ui/redesigned/Stack';
import { AppLink } from '@/shared/ui/redesigned/AppLink';

interface FooterProps {
    className?: string;
}

export const Footer = memo((props: FooterProps) => {
    const { t } = useTranslation();
    const { className } = props;
    const footerItemsList = useFooterItems();

    return (
        <VStack className={classNames(cls.Footer, {}, [className])}>
            <HStack>
                <AppLink />
            </HStack>
        </VStack>
    );
});
