import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import cls from './MainPageSections.module.scss';
import { Card } from '@/shared/ui/redesigned/Card';
import { HStack } from '@/shared/ui/redesigned/Stack';
import { Text } from '@/shared/ui/redesigned/Text';
import { AppImage } from '@/shared/ui/redesigned/AppImage';
import { sectionsArrText } from '../../lib/const/sections';

interface MainPageSectionsProps {
    className?: string;
}

export const MainPageSections = memo((props: MainPageSectionsProps) => {
    const { t } = useTranslation();
    const { className } = props;

    return (
        <HStack wrap="wrap">
            {sectionsArrText.map((section) => (
                <Card key={section.name} className={cls.card}>
                    <Text title={section.name} text={section.text} />
                    <AppImage src={section.img} className={cls.image} />
                </Card>
            ))}
        </HStack>
    );
});
