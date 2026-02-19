import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { classNames } from '@/shared/lib/classNames/classNames';
import cls from './VideosPage.module.scss';

interface VideosPageProps {
    className?: string;
}

const VideosPage = memo((props: VideosPageProps) => {
    const { className } = props;
    const { t } = useTranslation();

    return <div className={classNames(cls.VideosPage, {}, [className])}>1</div>;
});
export default VideosPage;
