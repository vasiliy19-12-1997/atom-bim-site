import { useState, useCallback } from 'react';
import { BrowserView, MobileView } from 'react-device-detect';
import { NotificationList } from '@/entities/Notification';
import { Drawer } from '@/shared/ui/redesigned/Drawer';
import cls from './NotificationButton.module.scss';
import { Icon } from '@/shared/ui/redesigned/Icon';
import NotificationIcon from '@/shared/assets/icons/notification.svg';
import { PopOver } from '@/shared/ui/redesigned/Popups';

export const NotificationButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    const onOpenDrawer = useCallback(() => {
        setIsOpen(true);
    }, []);
    const onCloseDrawer = useCallback(() => {
        setIsOpen(false);
    }, []);
    const trigger = (
        <Icon Svg={NotificationIcon} clickable onClick={onOpenDrawer} />
    );
    return (
        <div>
            <BrowserView>
                <PopOver className={cls.one} direction="bottom left" trigger={trigger}>
                                            <NotificationList className={cls.notifications} />
                                        </PopOver>
            </BrowserView>
            <MobileView>
                {trigger}
                <Drawer isOpen={isOpen} onClose={onCloseDrawer}>
                    <NotificationList />
                </Drawer>
            </MobileView>
        </div>
    );
};
