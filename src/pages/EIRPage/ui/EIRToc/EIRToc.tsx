import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { EIRTocItem } from '@/entities/EIR';
import { classNames } from '@/shared/lib/classNames/classNames';
import cls from './EIRToc.module.scss';

interface EIRTocProps {
    className?: string;
    toc: EIRTocItem[];
    activeId?: string;
}

const scrollToId = (id: string) => {
    const heading = document.getElementById(id);
    if (!heading) {
        return;
    }

    heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export const EIRToc = memo((props: EIRTocProps) => {
    const { className, toc, activeId } = props;
    const { t } = useTranslation();

    return (
        <aside className={classNames(cls.EIRToc, {}, [className])}>
            <h3 className={cls.title}>{t('На этой странице')}</h3>
            <ul className={cls.list}>
                {toc.map((item) => (
                    <li
                        key={item.id}
                        className={classNames(cls.item, {
                            [cls.level2]: item.level === 2,
                            [cls.level3]: item.level === 3,
                            [cls.active]: activeId === item.id,
                        })}
                    >
                        <a
                            className={cls.link}
                            href={`#${item.id}`}
                            onClick={(event) => {
                                event.preventDefault();
                                scrollToId(item.id);
                            }}
                        >
                            {item.title}
                        </a>
                    </li>
                ))}
            </ul>
        </aside>
    );
});
