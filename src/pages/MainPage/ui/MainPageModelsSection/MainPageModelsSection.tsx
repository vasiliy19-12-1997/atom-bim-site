import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import cls from './MainPageModelsSection.module.scss';
import { AppImage } from '@/shared/ui/redesigned/AppImage';
import { Card } from '@/shared/ui/redesigned/Card';
import { VStack, HStack } from '@/shared/ui/redesigned/Stack';
import { modelsSections } from '../../lib/const/modelsSections';
import { Text } from '@/shared/ui/redesigned/Text';

interface MainPageModelsSectionProps {
    className?: string;
}

export const MainPageModelsSection = memo((props: MainPageModelsSectionProps) => {
    const { t } = useTranslation();
    const { className } = props;

    return (
        <VStack
            max
            gap={32}
        >
            <Text title={t('Построенные модели')} />
            {modelsSections.map((section, index) => {
                return (
                    <Card
                        max
                        key={index}
                        border="partial_round"
                        className={cls.modelCard}
                        padding="24"
                    >
                        <HStack
                            max
                            justify="between"
                        >
                            <VStack>
                                <Text title={section.title} />
                                <Text text={section.description} />

                                {section.stats.map((stat) => (
                                    <Text text={`${stat.label} - ${stat.value}`} />
                                ))}
                            </VStack>
                        </HStack>
                    </Card>
                );
            })}
        </VStack>
    );
});
