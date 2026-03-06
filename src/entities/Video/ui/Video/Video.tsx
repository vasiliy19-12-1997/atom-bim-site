import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { classNames } from '@/shared/lib/classNames/classNames';
import cls from './Video.module.scss';

interface VideoProps {
    className?: string;
}

export const Video = memo((props: VideoProps) => {
    const { className } = props;
    const { t } = useTranslation();

    return <div className={classNames(cls.Video, {}, [className])}>Video</div>;
});
