import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { InstructionBreadcrumb } from '@/entities/Instruction';
import { getRouteInstruction } from '@/shared/const/router';
import { classNames } from '@/shared/lib/classNames/classNames';
import { AppLink } from '@/shared/ui/AppLink/AppLink';
import cls from './InstructionBreadcrumbs.module.scss';

interface InstructionBreadcrumbsProps {
    className?: string;
    breadcrumbs: InstructionBreadcrumb[];
}

export const InstructionBreadcrumbs = memo((props: InstructionBreadcrumbsProps) => {
    const { className, breadcrumbs } = props;
    const { t } = useTranslation();

    return (
        <nav
            className={classNames(cls.InstructionBreadcrumbs, {}, [className])}
            aria-label={t('breadcrumbs')}
        >
            <AppLink
                to={getRouteInstruction()}
                className={cls.link}
            >
                {t('Инструкции')}
            </AppLink>
            {breadcrumbs.slice(1).map((crumb, index) => (
                <span
                    key={`${crumb.slug}-${index}`}
                    className={cls.item}
                >
                    <span className={cls.separator} />
                    <span>{crumb.title}</span>
                </span>
            ))}
        </nav>
    );
});
