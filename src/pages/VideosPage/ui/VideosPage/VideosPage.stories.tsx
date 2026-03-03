import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import VideosPage from './VideosPage';

export default {
    title: 'pages/VideosPage',
    component: VideosPage,
    argTypes: {
        backgroundColor: { control: 'color' },
    },
} as ComponentMeta<typeof VideosPage>;

const Template: ComponentStory<typeof VideosPage> = (args) => <VideosPage {...args} />;

export const Normal = Template.bind({});
Normal.args = {};
