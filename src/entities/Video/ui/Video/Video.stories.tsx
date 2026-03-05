import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Video } from './Video';

export default {
    title: 'entities/Video',
    component: Video,
    argTypes: {
        backgroundColor: { control: 'color' },
    },
} as ComponentMeta<typeof Video>;

const Template: ComponentStory<typeof Video> = (args) => <Video {...args} />;

export const Normal = Template.bind({});
Normal.args = {
   
};