import { FC } from 'react';
import { LinkProps, NavLink } from 'react-router-dom';
import { classNames } from '@/shared/lib/classNames/classNames';
import cls from './AppLink.module.scss';

export type AppLinkVariant = 'primary' | 'secondary' | 'red';
export type AppLinkSize = 's' | 'm' | 'l';

interface AppLinkProps extends LinkProps {
    className?: string;
    variant?: AppLinkVariant;
    activeClassName?: string;
    size?: AppLinkSize;
}
const mapClassSize: Record<AppLinkSize, string> = {
    s: cls.size_s,
    m: cls.size_m,
    l: cls.size_l,
};
export const AppLink: FC<AppLinkProps> = (props) => {
    const { to, className, children, variant = 'primary', activeClassName = '', size = 'm', ...otherProps } = props;
    const sizeClass = mapClassSize[size];

    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                classNames(cls.AppLink, { [activeClassName]: isActive }, [className, cls[variant], sizeClass])
            }
            {...otherProps}
        >
            {children}
        </NavLink>
    );
};
