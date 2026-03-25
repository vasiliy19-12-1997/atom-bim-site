import { memo, useCallback } from 'react';
import DarkIcon from '@/shared/assets/icons/old/theme-dark.svg';
import LightIcon from '@/shared/assets/icons/old/theme-light.svg';
import { Theme } from '@/shared/const/theme';
import { classNames } from '@/shared/lib/classNames/classNames';
import { useTheme } from '@/shared/lib/hooks/useTheme/useTheme';
import { Button } from '../../Button/Button';

interface ThemeSwitcherProps {
    className?: string;
}

export const ThemeSwitcher = memo(({ className }: ThemeSwitcherProps) => {
    const { theme, toggleTheme } = useTheme();

    const handlerClick = useCallback(() => {
        toggleTheme();
    }, [toggleTheme]);

    return (
        <Button
            variant="clear"
            className={classNames('', {}, [className])}
            onClick={handlerClick}
        >
            {theme === Theme.DARK ? <DarkIcon /> : <LightIcon />}
        </Button>
    );
});
