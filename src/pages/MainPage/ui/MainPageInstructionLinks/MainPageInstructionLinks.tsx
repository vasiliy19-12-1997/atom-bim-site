import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetInstructionLinksQuery } from '@/entities/Instruction';
import { getRouteInstruction } from '@/shared/const/router';
import { classNames } from '@/shared/lib/classNames/classNames';
import { AppLink } from '@/shared/ui/redesigned/AppLink';
import { Card } from '@/shared/ui/redesigned/Card';
import { HStack, VStack } from '@/shared/ui/redesigned/Stack';
import { Text } from '@/shared/ui/redesigned/Text';
import cls from './MainPageInstructionLinks.module.scss';

interface MainPageInstructionLinksProps {
    className?: string;
}

export const MainPageInstructionLinks = memo((props: MainPageInstructionLinksProps) => {
    const { className } = props;
    const { t } = useTranslation();
    const { data, isLoading } = useGetInstructionLinksQuery();

    return (
        <Card
            padding="24"
            border="round"
            className={classNames(cls.linksCard, {}, [className])}
        >
            <VStack max gap={16}>
                <VStack gap={8}>
                    <Text title={t('Инструкции из NocoDB')} size="l" bold />
                    <Text text={t('Ссылки на статьи Yandex Wiki, доступные для перехода внутри сайта.')} size="s" />
                </VStack>

                {isLoading && (
                    <Text text={t('Загрузка ссылок...')} size="s" />
                )}

                {!isLoading && !data?.length && (
                    <Text text={t('Ссылки инструкций пока не найдены.')} size="s" />
                )}

                {!!data?.length && (
                    <VStack gap={8}>
                        {data.slice(0, 12).map((item) => (
                            <HStack key={item.id} max justify="between" className={cls.linkRow}>
                                <AppLink
                                    to={getRouteInstruction(item.slug)}
                                    className={cls.link}
                                >
                                    {item.title}
                                </AppLink>
                            </HStack>
                        ))}
                    </VStack>
                )}
            </VStack>
        </Card>
    );
});

