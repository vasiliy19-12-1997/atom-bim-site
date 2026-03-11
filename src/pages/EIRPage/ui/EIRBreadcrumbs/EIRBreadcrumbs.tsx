import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { EIRBreadcrumb } from '@/entities/EIR';
import { getRouteEir } from '@/shared/const/router';
import { classNames } from '@/shared/lib/classNames/classNames';
import { AppLink } from '@/shared/ui/AppLink/AppLink';
import cls from './EIRBreadcrumbs.module.scss';

interface EIRBreadcrumbsProps {
    className?: string;
    breadcrumbs: EIRBreadcrumb[];
}

export const EIRBreadcrumbs = memo((props: EIRBreadcrumbsProps) => {
    const { className, breadcrumbs } = props;
    const { t } = useTranslation();

    return (
        <nav
            className={classNames(cls.EIRBreadcrumbs, {}, [className])}
            aria-label={t('breadcrumbs')}
        >
            <AppLink
                to={getRouteEir()}
                className={cls.link}
            >
                {t('EIR')}
            </AppLink>
            {breadcrumbs.slice(1).map((crumb) => (
                <span
                    key={crumb.slug}
                    className={cls.item}
                >
                    <span className={cls.separator} />
                    <span>{crumb.title}</span>
                </span>
            ))}
        </nav>
    );
});
