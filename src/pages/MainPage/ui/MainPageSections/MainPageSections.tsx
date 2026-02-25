import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import cls from './MainPageSections.module.scss';
import { Card } from '@/shared/ui/redesigned/Card';
import { HStack, VStack } from '@/shared/ui/redesigned/Stack';
import { Text } from '@/shared/ui/redesigned/Text';
import { AppImage } from '@/shared/ui/redesigned/AppImage';
import { sectionsArrText } from '../../lib/const/sections';
import { classNames } from '@/shared/lib/classNames/classNames';
import inforIcon from '@/shared/assets/icons/new/Information 24px.svg';
import { Icon } from '@/shared/ui/redesigned/Icon';

interface MainPageSectionsProps {
    className?: string;
}

export const MainPageSections = memo((props: MainPageSectionsProps) => {
    const { t } = useTranslation();
    const { className } = props;

    return (
        <HStack max gap={32} wrap="wrap" className={classNames(cls.MainPageSections, {}, [])}>
            {sectionsArrText.map((section) => (
                // eslint-disable-next-line react/jsx-max-props-per-line
                <Card max padding="24" border="round" key={section.name} className={cls.card}>
                    <VStack max gap={16} className={cls.textWrapper}>
                        <Text title={section.name} />
                        <Text text={section.text} />
                    </VStack>
                    <HStack className={cls.imgWrapper} max>
                        <Icon Svg={inforIcon} className={cls.icon} />
                        <AppImage src={section.img} className={cls.img} />
                    </HStack>
                </Card>
            ))}
        </HStack>
    );
});
