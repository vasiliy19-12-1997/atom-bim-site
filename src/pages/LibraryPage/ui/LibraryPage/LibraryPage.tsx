import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { classNames } from '@/shared/lib/classNames/classNames';
import cls from './LibraryPage.module.scss';

interface LibraryPageProps {
    className?: string;
}

const LibraryPage = memo((props: LibraryPageProps) => {
    const { className } = props;
    const { t } = useTranslation();

    return <div className={classNames(cls.LibraryPage, {}, [className])}>1</div>;
});
export default LibraryPage;
