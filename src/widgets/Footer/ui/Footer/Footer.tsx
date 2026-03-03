import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import AtomIcon from '@/shared/assets/icons/new/AtomIcon.svg';
import { classNames } from '@/shared/lib/classNames/classNames';
import { AppLink } from '@/shared/ui/redesigned/AppLink';
import { Button } from '@/shared/ui/redesigned/Button';
import { Icon } from '@/shared/ui/redesigned/Icon';
import { HStack, VStack } from '@/shared/ui/redesigned/Stack';
import { Text } from '@/shared/ui/redesigned/Text';
import { useFooterItems } from '../../model/selectors/useFooterItems';
import cls from './Footer.module.scss';
import { FooterContent } from '../FooterContent/FooterContent';
interface FooterProps {
    className?: string;
}

export const Footer = memo((props: FooterProps) => {
    const { t } = useTranslation();
    const { className } = props;
    const footerItemsList = useFooterItems();

    return <FooterContent />;
});
