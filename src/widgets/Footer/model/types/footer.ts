import { SVGProps, VFC } from 'react';

export interface FooterItemProps {
    path: string;
    text: string;
    Icon?: VFC<SVGProps<SVGSVGElement>>;
    authOnly?: boolean;
}
