import { memo, useMemo, useState } from 'react';
import { LangSwitcher } from '@/features/LangSwitcher';
import { ThemeSwitcher } from '@/features/ThemeSwitcher';
import ArrowIcon from '@/shared/assets/icons/old/arrow-bottom.svg';
import { classNames } from '@/shared/lib/classNames/classNames';
import { AppLogo } from '@/shared/ui/redesigned/AppLogo';
import { Icon } from '@/shared/ui/redesigned/Icon';
import { HStack, VStack } from '@/shared/ui/redesigned/Stack';
import { useSidebarItems } from '../../model/selectors/getSidebarItems';
import { SidebarItem } from '../SidebarItem/SidebarItem';
import cls from './Sidebar.module.scss';

interface SidebarProps {
    className?: string;
}

export const Sidebar = memo(({ className }: SidebarProps) => {
    const [collapsed, setCollapsed] = useState(false);
    const sidebarItemsList = useSidebarItems();

    const onToggle = () => {
        setCollapsed((prev) => !prev);
    };

    const itemsList = useMemo(() => {
        return sidebarItemsList.map((item) => (
            <SidebarItem
                key={item.path}
                item={item}
                collapsed={collapsed}
            />
        ));
    }, [sidebarItemsList, collapsed]);

    return (
        <aside
            data-testid="sidebar"
            className={classNames(cls.SidebarRedesign, { [cls.collapsedRedesign]: collapsed }, [className])}
        >
            <VStack
                max
                className={cls.inner}
            >
                <HStack
                    justify="center"
                    className={cls.logoWrapper}
                >
                    <AppLogo
                        size={collapsed ? 34 : 52}
                        className={cls.appLogo}
                    />
                </HStack>

                <VStack
                    role="navigation"
                    gap={8}
                    className={cls.items}
                >
                    {itemsList}
                </VStack>

                <VStack
                    gap={16}
                    className={cls.footerControls}
                >
                    <ThemeSwitcher className={cls.theme} />
                    <LangSwitcher
                        className={cls.lang}
                        short={collapsed}
                    />
                </VStack>
            </VStack>

            <button
                type="button"
                data-testid="sidebar-toggle"
                onClick={onToggle}
                className={cls.collapsedBtn}
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
                <Icon
                    Svg={ArrowIcon}
                    clickable={false}
                />
            </button>
        </aside>
    );
});
