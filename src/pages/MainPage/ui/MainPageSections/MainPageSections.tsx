import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import cls from './MainPageSections.module.scss';
import { Card } from '@/shared/ui/redesigned/Card';
import { HStack } from '@/shared/ui/redesigned/Stack';
import { Text } from '@/shared/ui/redesigned/Text';
import sectionEir from '../assets/section_eir.png';
import { AppImage } from '@/shared/ui/redesigned/AppImage';

interface MainPageSectionsProps {
    className?: string;
}

export const MainPageSections = memo((props: MainPageSectionsProps) => {
    const { t } = useTranslation();
    const { className } = props;

    const sectionsArrText = [
        {
            name: 'EIR',
            text: 'Корпоративный стандарт цифрового моделирования объектов капитального строительства.',
            img: sectionEir,
        },
        {
            name: 'Библиотека',
            text: 'Шаблоны проектов для разделоа АР, КЖ, ВК, ОВ, ЭЛ, разработанные семейства. плагины по автоматизации проектирования',
        },
        {
            name: 'Этапы моделирования',
            text: 'Поэтапное описание процесса создания цифровой модели.',
        },
        {
            name: 'Инструкции',
            text: 'Перечень инструкций и методических материалов по работе в Autodesk Revit и Civil 3D.',
        },
        {
            name: 'Видеоматериалы',
            text: 'Видеоролики, инструкции, вебинары по разработке цифровой модели.',
        },
        {
            name: 'Тесты',
            text: 'Внутренняя система тестирования сотрудников и специалистов по цифровому моделированию',
        },
    ];
    return (
        <HStack wrap="wrap">
            {sectionsArrText.map((section) => (
                <Card key={section.name} className={cls.card}>
                    <Text title={section.name} text={section.text} />
                    <AppImage src={section.img} />
                </Card>
            ))}
        </HStack>
    );
});
