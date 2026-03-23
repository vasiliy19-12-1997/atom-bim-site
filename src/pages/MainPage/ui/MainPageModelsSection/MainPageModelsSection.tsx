import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import cls from './MainPageModelsSection.module.scss';
import { AppImage } from '@/shared/ui/redesigned/AppImage';
import { Card } from '@/shared/ui/redesigned/Card';
import { VStack, HStack } from '@/shared/ui/redesigned/Stack';
import { modelsSections } from '../../lib/const/modelsSections';
import { Text } from '@/shared/ui/redesigned/Text';
import { classNames } from '@/shared/lib/classNames/classNames';

interface MainPageModelsSectionProps {
    className?: string;
}

export const MainPageModelsSection = memo((props: MainPageModelsSectionProps) => {
    const { t } = useTranslation();
    const { className } = props;

    return (
        <section className={classNames(cls.MainPageModelsSection, {}, [className])}>
            <Text
                title={t('Построенные модели')}
                size="l"
                bold
                className={cls.title}
            />

            <VStack
                max
                gap={24}
            >
                {modelsSections.map((section, index) => {
                    const isReversed = index % 2 !== 0;

                    return (
                        <HStack
                            max
                            gap={24}
                            key={section.title}
                            className={classNames(cls.modelRow, { [cls.reversed]: isReversed }, [])}
                        >
                            <Card
                                variant="outlined"
                                max
                                border="partial_round"
                                className={cls.modelCard}
                                padding="24"
                            >
                                <VStack
                                    max
                                    gap={16}
                                    className={cls.modelCardInner}
                                >
                                    <Text
                                        title={section.title}
                                        size="m"
                                        bold
                                        className={cls.modelTitle}
                                    />
                                    <Text
                                        text={section.description}
                                        size="s"
                                        className={cls.modelDescription}
                                    />

                                    <HStack
                                        gap={16}
                                        wrap="wrap"
                                        className={cls.stats}
                                    >
                                        {section.stats.map((stat) => (
                                            <Card
                                                key={stat.label}
                                                padding="16"
                                                border="partial_round"
                                                variant="light"
                                                className={cls.statCard}
                                            >
                                                <Text
                                                    text={`${stat.label}: ${stat.value}`}
                                                    size="s"
                                                    className={cls.statText}
                                                />
                                            </Card>
                                        ))}
                                    </HStack>

                                </VStack>
                            </Card>
                            <AppImage
                                className={cls.image}
                                src={section.img}
                                width={380}
                                height={380}
                            />
                        </HStack>
                    );
                })}
            </VStack>
        </section>
    );
});
