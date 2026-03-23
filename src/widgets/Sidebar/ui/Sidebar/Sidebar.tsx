import { memo, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LangSwitcher } from '@/features/LangSwitcher';
import { ThemeSwitcher } from '@/features/ThemeSwitcher';
import ArrowIcon from '@/shared/assets/icons/old/arrow-bottom.svg';
import BurgerIcon from '@/shared/assets/icons/new/Burger 24px.svg';
import CloseIcon from '@/shared/assets/icons/new/Close 24px.svg';
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

const MOBILE_BREAKPOINT = 640;
const TABLET_BREAKPOINT = 900;

export const Sidebar = memo(({ className }: SidebarProps) => {
    const { t } = useTranslation();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpened, setMobileOpened] = useState(false);
    const sidebarItemsList = useSidebarItems();
    const { pathname } = useLocation();

    useEffect(() => {
        const mobileQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
        const tabletQuery = window.matchMedia(`(max-width: ${TABLET_BREAKPOINT}px)`);

        const syncSidebarState = () => {
            setCollapsed(tabletQuery.matches && !mobileQuery.matches);

            if (!mobileQuery.matches) {
                setMobileOpened(false);
            }
        };

        syncSidebarState();
        mobileQuery.addEventListener('change', syncSidebarState);
        tabletQuery.addEventListener('change', syncSidebarState);

        return () => {
            mobileQuery.removeEventListener('change', syncSidebarState);
            tabletQuery.removeEventListener('change', syncSidebarState);
        };
    }, []);

    useEffect(() => {
        setMobileOpened(false);
    }, [pathname]);

    useEffect(() => {
        document.body.style.overflow = mobileOpened ? 'hidden' : '';

        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileOpened]);

    const onToggleCollapsed = () => {
        setCollapsed((prev) => !prev);
    };

    const onToggleMobileSidebar = () => {
        setMobileOpened((prev) => !prev);
    };

    const onCloseMobileSidebar = () => {
        setMobileOpened(false);
    };

    const itemsList = useMemo(() => {
        return sidebarItemsList.map((item) => (
            <SidebarItem
                key={item.path}
                item={item}
                collapsed={collapsed}
                onClick={onCloseMobileSidebar}
            />
        ));
    }, [sidebarItemsList, collapsed]);

    return (
        <>
            <button
                type="button"
                className={classNames(cls.mobileMenuButton, { [cls.mobileMenuButtonOpened]: mobileOpened })}
                onClick={onToggleMobileSidebar}
                aria-label={mobileOpened ? t('Закрыть меню навигации') : t('Открыть меню навигации')}
            >
                <Icon
                    Svg={mobileOpened ? CloseIcon : BurgerIcon}
                    clickable={false}
                />
            </button>

            <button
                type="button"
                className={classNames(cls.mobileOverlay, { [cls.mobileOverlayOpened]: mobileOpened })}
                onClick={onCloseMobileSidebar}
                aria-label={t('Закрыть фон навигации')}
            />

            <aside
                data-testid="sidebar"
                className={classNames(
                    cls.SidebarRedesign,
                    {
                        [cls.collapsedRedesign]: collapsed,
                        [cls.mobileOpened]: mobileOpened,
                    },
                    [className],
                )}
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
                    onClick={onToggleCollapsed}
                    className={cls.collapsedBtn}
                    aria-label={collapsed ? t('Развернуть боковую панель') : t('Свернуть боковую панель')}
                >
                    <Icon
                        Svg={ArrowIcon}
                        clickable={false}
                    />
                </button>
            </aside>
        </>
    );
});
