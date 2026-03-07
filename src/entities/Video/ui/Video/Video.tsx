import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Video as VideoModel } from '../../model/types/video';
import { classNames } from '@/shared/lib/classNames/classNames';
import cls from './Video.module.scss';

interface VideoProps {
    className?: string;
    video: VideoModel;
}

export const Video = memo((props: VideoProps) => {
    const { className, video } = props;
    const { t } = useTranslation();

    return (
        <article className={classNames(cls.Video, {}, [className])}>
            <h3 className={cls.title}>{video.title}</h3>
            <div className={cls.meta}>
                <span>{video.type}</span>
                <span>{video.section}</span>
                <span>{video.software}</span>
            </div>
            <div className={cls.player}>
                <iframe
                    src={video.link}
                    title={video.title}
                    loading="lazy"
                    allowFullScreen
                />
            </div>
            <a
                className={cls.link}
                href={video.link}
                target="_blank"
                rel="noreferrer"
            >
                {t('Open video')}
            </a>
        </article>
    );
});
