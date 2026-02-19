import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { LibraryPage } from './LibraryPage';

export default {
    title: 'pages/LibraryPage',
    component: LibraryPage,
    argTypes: {
        backgroundColor: { control: 'color' },
    },
} as ComponentMeta<typeof LibraryPage>;

const Template: ComponentStory<typeof LibraryPage> = (args) => <LibraryPage {...args} />;

export const Normal = Template.bind({});
Normal.args = {
   
};