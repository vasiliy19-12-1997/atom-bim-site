import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { TestsPage } from './TestsPage';

export default {
    title: 'pages/TestsPage',
    component: TestsPage,
    argTypes: {
        backgroundColor: { control: 'color' },
    },
} as ComponentMeta<typeof TestsPage>;

const Template: ComponentStory<typeof TestsPage> = (args) => <TestsPage {...args} />;

export const Normal = Template.bind({});
Normal.args = {
   
};