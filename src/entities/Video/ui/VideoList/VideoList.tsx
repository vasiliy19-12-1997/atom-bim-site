import { memo } from 'react';
import { Video as VideoModel } from '../../model/types/video';
import { Video } from '../Video/Video';
import { classNames } from '@/shared/lib/classNames/classNames';
import cls from './VideoList.module.scss';

interface VideoListProps {
    className?: string;
    videos: VideoModel[];
}

export const VideoList = memo((props: VideoListProps) => {
    const { className, videos } = props;

    return (
        <div className={classNames(cls.VideoList, {}, [className])}>
            {videos.map((video) => (
                <Video
                    key={video.id}
                    video={video}
                />
            ))}
        </div>
    );
});
