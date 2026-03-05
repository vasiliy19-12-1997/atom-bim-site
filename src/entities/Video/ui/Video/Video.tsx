import { classNames } from 'shared/lib/classNames/classNames';
import { useTranslation } from 'react-i18next';
import cls from './Video.module.scss';
import { memo } from 'react';

interface VideoProps {
    className?: string;
}

export const Video = memo((props: VideoProps) => {
    const { className } = props;
    const { t } = useTranslation();
    
    return (
        <div className={classNames(cls.Video, {}, [className])}>
           
        </div>
    );
});