import { addDecorator } from '@storybook/react';
import { RouterDecorator } from '../../src/shared/config/storybook/RouterDecorator/RouterDecorator';
import { StyleDecorator } from '../../src/shared/config/storybook/StyleDecorator/StyleDecorator';
import { SuspenceDecorator } from '../../src/shared/config/storybook/SuspenceDecorator/SuspenceDecorator';
import { ThemeDecorator } from '../../src/shared/config/storybook/ThemeDecorator/ThemeDecorator';
import { Theme } from '../../src/shared/const/theme';

export const parameters = {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },
    layout: 'fullscreen',
    themes: {
        default: 'light',
        list: [
            { name: 'light', class: Theme.LIGHT, color: '#008060' },
            { name: 'dark', class: Theme.DARK, color: '#121212' },
            { name: 'corporate', class: Theme.CORPORATE, color: '#82ca9c' },
        ],
    },
};

addDecorator(StyleDecorator);
// addDecorator(TranslationDecorator);
addDecorator(ThemeDecorator(Theme.LIGHT));
addDecorator(RouterDecorator);
addDecorator(SuspenceDecorator);
