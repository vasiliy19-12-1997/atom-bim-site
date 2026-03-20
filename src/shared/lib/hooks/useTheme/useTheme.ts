import { useContext } from 'react';
import { Theme } from '@/shared/const/theme';
import { ThemeContext } from '../../context/ThemeContext';

interface UseThemeResult {
    toggleTheme: (saveAction?: (theme: Theme) => void) => void;
    theme: Theme;
}

export function useTheme(): UseThemeResult {
    const { theme, setTheme } = useContext(ThemeContext);

    const toggleTheme = (saveAction?: (theme: Theme) => void) => {
        let newTheme: Theme;
        switch (theme) {
            case Theme.LIGHT:
                newTheme = Theme.DARK;
                break;
            case Theme.DARK:
                newTheme = Theme.CORPORATE;
                break;
            case Theme.CORPORATE:
                newTheme = Theme.LIGHT;
                break;

            default:
                newTheme = Theme.LIGHT;
                break;
        }
        setTheme?.(newTheme);
        saveAction?.(newTheme);
    };

    return {
        theme: theme || Theme.LIGHT,
        toggleTheme,
    };
}
