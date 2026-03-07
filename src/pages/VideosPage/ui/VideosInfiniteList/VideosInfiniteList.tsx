import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { VideoCard } from '@/entities/Video';
import { classNames } from '@/shared/lib/classNames/classNames';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { useInitialEffect } from '@/shared/lib/hooks/useInitialEffect/useInitialEffect';
import { Text, TextTheme } from '@/shared/ui/deprecated/Text';
import { initVideosPage } from '../../model/services/initVideosPage/initVideosPage';
import { getVideos } from '../../model/slices/VideosPageSlice';
import { getVideosError, getVideosIsLoading } from '../../model/selectors/videos';
import cls from './VideosInfiniteList.module.scss';

interface VideosInfiniteListProps {
    className?: string;
}

export const VideosInfiniteList = memo((props: VideosInfiniteListProps) => {
    const { className } = props;
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const [searchParams] = useSearchParams();

    const videos = useSelector(getVideos.selectAll);
    const isLoading = useSelector(getVideosIsLoading);
    const error = useSelector(getVideosError);

    useInitialEffect(() => {
        dispatch(initVideosPage(searchParams));
    }, [dispatch, searchParams]);

    if (error) {
        return (
            <Text
                className={className}
                title={t('Failed to load videos')}
                text={error}
                theme={TextTheme.ERROR}
            />
        );
    }

    if (!isLoading && videos.length === 0) {
        return (
            <Text
                className={className}
                title={t('No videos found')}
            />
        );
    }

    return (
        <div className={classNames(cls.VideosInfiniteList, {}, [className])}>
            {videos.map((video) => (
                <VideoCard
                    key={video.id}
                    video={video}
                />
            ))}
            {isLoading && <Text title={t('Loading videos...')} />}
        </div>
    );
});
