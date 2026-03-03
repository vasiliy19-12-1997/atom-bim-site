import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getAuthUserData } from '@/entities/User';
import { LoginModal } from '@/features/AuthByUsername';
import { AvatarDropDown } from '@/features/AvatarDropDown';
import { NotificationButton } from '@/features/NotificationButton';
import { classNames } from '@/shared/lib/classNames/classNames';
import cls from './Navbar.module.scss';
import { HStack } from '@/shared/ui/redesigned/Stack';
import { Button } from '@/shared/ui/redesigned/Button';

interface NavbarProps {
    className?: string;
}

export const Navbar = ({ className }: NavbarProps) => {
    const { t } = useTranslation();
    const [isAuthModal, setIsAuthModal] = useState(false);
    const authUser = useSelector(getAuthUserData);

    const onShowModal = useCallback(() => {
        setIsAuthModal(true);
    }, []);

    const onCloseModal = useCallback(() => {
        setIsAuthModal(false);
    }, []);

    const mainClass = cls.NavbarRedesign;

    if (authUser) {
        return (
            <header className={classNames(cls.NavbarRedesigned, {}, [className])}>
                                    <HStack gap={16} className={cls.actions}>
                                        <NotificationButton />
                                        <AvatarDropDown />
                                    </HStack>
                                </header>
        );
    }
    return (
        <header className={classNames(mainClass, {}, [className])}>
            <Button className={cls.links} variant="clear" onClick={onShowModal}>
                                    {t('Войти')}
                                </Button>
            {isAuthModal && <LoginModal isOpen={isAuthModal} onClose={onCloseModal} />}
        </header>
    );
};
