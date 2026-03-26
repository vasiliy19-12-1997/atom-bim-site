import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { classNames } from '@/shared/lib/classNames/classNames';
import { FooterContentColumns } from '../FooterContentColumns/FooterContentColumns';
import { FooterContentLinks } from '../FooterContentLinks/FooterContentLinks';
import cls from './FooterContent.module.scss';

interface FooterContentProps {
    className?: string;
}

export const FooterContent = memo((props: FooterContentProps) => {
    const { t } = useTranslation();
    const { className } = props;

    return (
        <footer className={classNames(cls.FooterContent, {}, [className])}>
            <div className={cls.glow} />
            <div className={cls.container}>
                <FooterContentColumns />
                <FooterContentLinks />
            </div>
        </footer>
    );
});
