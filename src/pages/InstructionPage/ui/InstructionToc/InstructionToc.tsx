import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { InstructionTocItem } from '@/entities/Instruction';
import { classNames } from '@/shared/lib/classNames/classNames';
import cls from './InstructionToc.module.scss';

interface InstructionTocProps {
    className?: string;
    toc: InstructionTocItem[];
    activeId?: string;
}

export const InstructionToc = memo((props: InstructionTocProps) => {
    const { className, toc, activeId } = props;
    const { t } = useTranslation();

    return (
        <aside className={classNames(cls.InstructionToc, {}, [className])}>
            <h3 className={cls.title}>{t('На этой странице')}</h3>
            <ul className={cls.list}>
                {toc.map((item) => (
                    <li
                        key={item.id}
                        className={classNames(cls.item, {
                            [cls.level3]: item.level === 3,
                            [cls.active]: activeId === item.id,
                        })}
                    >
                        <a
                            className={cls.link}
                            href={`#${item.id}`}
                        >
                            {item.title}
                        </a>
                    </li>
                ))}
            </ul>
        </aside>
    );
});
