import { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { VideoMainSections, Video as VideoModel, VideoSoftware, VideoType } from '../../model/types/video';
import { classNames } from '@/shared/lib/classNames/classNames';
import cls from './Video.module.scss';
import { Button } from '@/shared/ui/redesigned/Button';

interface VideoProps {
    className?: string;
    video: VideoModel;
}

export const Video = memo((props: VideoProps) => {
    const { className, video } = props;
    const { t } = useTranslation();
    const [isPlayerOpened, setIsPlayerOpened] = useState(true);

    const videoMapperTexts: Record<VideoType | VideoSoftware | VideoMainSections, string> = {
        [VideoType.VIDEO_INSTRUCTION]: t('Видео инструкции'),
        [VideoType.WEBINARS]: t('Вебинары'),
        [VideoType.PLUGINS]: t('Плагины'),
        [VideoType.ALL]: t('Все'),
        [VideoSoftware.AUTOCAD]: t('AutoCAD'),
        [VideoSoftware.REVIT]: t('Revit'),
        [VideoSoftware.TANGL_VALUE]: t('Tangl Value'),
        [VideoSoftware.CIVIL3D]: t('Civil 3D'),
        [VideoMainSections.COMMON]: t('Общие'),
        [VideoMainSections.AR]: t('АР'),
        [VideoMainSections.KR]: t('КР'),
        [VideoMainSections.OV]: t('ОВ'),
        [VideoMainSections.VK]: t('ВК'),
        [VideoMainSections.EL]: t('ЭЛ'),
    };

    const onOpenPlayer = useCallback(() => {
        setIsPlayerOpened(true);
    }, []);

    return (
        <article className={classNames(cls.Video, {}, [className])}>
            <h3 className={cls.title}>{video.title}</h3>
            <div className={cls.meta}>
                <span>{videoMapperTexts[video.type]}</span>
                <span>{videoMapperTexts[video.section]}</span>
                <span>{videoMapperTexts[video.software]}</span>
            </div>
            <div className={cls.player}>
                {isPlayerOpened ? (
                    <iframe
                        src={video.link}
                        title={video.title}
                        loading="lazy"
                        allowFullScreen
                    />
                ) : (
                    <Button
                        type="button"
                        className={cls.preview}
                        onClick={onOpenPlayer}
                    >
                        {t('Play video')}
                    </Button>
                )}
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
