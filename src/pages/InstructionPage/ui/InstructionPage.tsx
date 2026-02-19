import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { classNames } from '@/shared/lib/classNames/classNames';
import cls from './InstructionPage.module.scss';

interface InstructionPageProps {
    className?: string;
}

const InstructionPage = memo((props: InstructionPageProps) => {
    const { t } = useTranslation();
    const { className } = props;

    return <div className={classNames(cls.InstructionPage, {}, [className])}>1</div>;
});

export default InstructionPage;
