import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getAuthUserData } from '@/entities/User';
import { classNames } from '@/shared/lib/classNames/classNames';
import { SidebarItemType } from '../../model/types/sidebar';
import cls from './SidebarItem.module.scss';
import { AppLink } from '@/shared/ui/redesigned/AppLink';
import { Icon } from '@/shared/ui/redesigned/Icon';

interface SidebarItemProps {
    item: SidebarItemType;
    collapsed: boolean;
}

export const SidebarItem = memo((props: SidebarItemProps) => {
    const { t } = useTranslation();
    const isAuth = useSelector(getAuthUserData);
    const { item, collapsed } = props;
    if (item.authOnly && !isAuth) {
        return null;
    }
    return (
        <AppLink
                            variant="secondary"
                            to={item.path}
                            className={classNames(cls.itemRedesign, { [cls.collapsedRedesign]: collapsed })}
                            activeClassName={cls.active}
                        >
                            <Icon Svg={item.Icon} />
                            <span className={cls.link}>{t(`${item.text}`)}</span>
                        </AppLink>
    );
});
