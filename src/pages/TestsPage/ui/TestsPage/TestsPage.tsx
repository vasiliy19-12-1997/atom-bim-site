import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { classNames } from '@/shared/lib/classNames/classNames';
import cls from './TestsPage.module.scss';

interface TestsPageProps {
    className?: string;
}

const TestsPage = memo((props: TestsPageProps) => {
    const { className } = props;
    const { t } = useTranslation();

    return <div className={classNames(cls.TestsPage, {}, [className])}>1</div>;
});
export default TestsPage;
