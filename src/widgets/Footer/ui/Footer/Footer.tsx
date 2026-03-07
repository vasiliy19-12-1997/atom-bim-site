import { memo } from 'react';
import { FooterContent } from '../FooterContent/FooterContent';

interface FooterProps {
    className?: string;
}

export const Footer = memo((props: FooterProps) => {
    const { className } = props;

    return <FooterContent className={className} />;
});
