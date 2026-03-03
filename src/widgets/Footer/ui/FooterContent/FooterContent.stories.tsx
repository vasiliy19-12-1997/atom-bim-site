import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Theme } from '@/shared/const/theme';
import { StoreDecorator } from '@/shared/config/storybook/StoreDecorator/StoreDecorator';
import { ThemeDecorator } from '@/shared/config/storybook/ThemeDecorator/ThemeDecorator';
import { FooterContent } from './FooterContent';

export default {
    title: 'widget/FooterContent',
    component: FooterContent,
    argTypes: {
        backgroundColor: { control: 'color' },
    },
} as ComponentMeta<typeof FooterContent>;

const Template: ComponentStory<typeof FooterContent> = (args) => <FooterContent {...args} />;

export const Light = Template.bind({});
Light.args = {};
Light.decorators = [
  ThemeDecorator(Theme.LIGHT),
  StoreDecorator({ user: { authData: { /* заполняйте по необходимости */ } } })
];

export const Dark = Template.bind({});
Dark.args = {};
Dark.decorators = [
  ThemeDecorator(Theme.DARK),
  StoreDecorator({ user: { authData: { /* заполняйте по необходимости */ } } })
];
