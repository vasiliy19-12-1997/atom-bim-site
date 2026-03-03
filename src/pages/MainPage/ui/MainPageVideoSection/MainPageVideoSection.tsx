import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/shared/ui/redesigned/Card';
import { HStack, VStack } from '@/shared/ui/redesigned/Stack';
import { Text } from '@/shared/ui/redesigned/Text';
import cls from './MainPageVideoSection.module.scss';

interface MainPageVideoSectionProps {
    className?: string;
}

export const MainPageVideoSection = memo((props: MainPageVideoSectionProps) => {
    const { t } = useTranslation();
    const { className } = props;

    return (
        <Card
            padding="24"
            border="round"
            className={cls.videoSection}
        >
            <VStack
                max
                gap={24}
            >
                <Text title={t('Видео о ТИМ департаменте')} />
                <HStack
                    max
                    justify="center"
                    className={cls.videoWrapper}
                >
                    <iframe
                        src="https://rutube.ru/play/embed/b191fbe1f8ad0f6e3733401faba62c1c"
                        title="Тим департмамент"
                        allow="autoplay"
                        allowFullScreen
                        width="100%"
                        height={600}
                        loading="lazy"
                    />
                </HStack>
            </VStack>
        </Card>
    );
});
