import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { VideoMainSections, VideoSoftware, VideoType } from '../../model/types/video';

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
    video: {
        id: '1',
        title: 'Sample Video',
        link: 'https://rutube.ru/play/embed/8736091992becc0799d81b0d5f184dd0',
        type: VideoType.VIDEO_INSTRUCTION,
        section: VideoMainSections.COMMON,
        software: VideoSoftware.REVIT,
    },
};
