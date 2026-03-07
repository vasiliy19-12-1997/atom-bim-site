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
        <section className={classNames(cls.wrapper, {}, [className])}>
            <VStack
                gap={8}
                className={cls.title}
            >
                <Text
                    title={t('Разделы сайта')}
                    size="l"
                    bold
                />
                <Text
                    text={t('Ключевые материалы, регламенты и BIM-инструменты в одном месте.')}
                    size="s"
                />
            </VStack>
            <HStack
                max
                gap={24}
                wrap="wrap"
                className={classNames(cls.MainPageSections, {}, [])}
            >
                {sectionsArrText.map((section) => (
                    <Card
                        max
                        padding="0"
                        border="partial_round"
                        key={section.name}
                        className={cls.card}
                    >
                        <VStack
                            max
                            gap={16}
                            className={cls.textWrapper}
                        >
                            <Text
                                title={section.name}
                                size="m"
                                bold
                            />
                            <Text
                                text={section.text}
                                size="s"
                            />
                        </VStack>
                        <HStack
                            className={cls.imgWrapper}
                            max
                        >
                            <Icon
                                Svg={inforIcon}
                                className={cls.icon}
                            />
                            <AppImage
                                src={section.img}
                                className={cls.img}
                            />
                        </HStack>
                    </Card>
                ))}
            </HStack>
        </section>
    );
});
