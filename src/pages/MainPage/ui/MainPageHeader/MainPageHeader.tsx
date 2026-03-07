import { memo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppImage } from '@/shared/ui/redesigned/AppImage';
import { Card } from '@/shared/ui/redesigned/Card';
import { HStack, VStack } from '@/shared/ui/redesigned/Stack';
import { Text } from '@/shared/ui/redesigned/Text';
import { classNames } from '@/shared/lib/classNames/classNames';
import mainImage from '../../lib/assets/licey6.jpg';
import innerImage from '../../lib/assets/licey_podl2.jpg';
import cls from './MainPageHeader.module.scss';

interface MainPageHeaderProps {
    className?: string;
}

export const MainPageHeader = memo((props: MainPageHeaderProps) => {
    const { t } = useTranslation();
    const { className } = props;
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHover, setIsHover] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const circleSize = 180;

    const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!wrapperRef.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setPosition({ x, y });
    };

    return (
        <section className={classNames(cls.MainPageHeader, {}, [className])}>
            <Card className={cls.heroCard} border="round" padding="24">
                <HStack max gap={32} className={cls.heroLayout}>
                    <VStack max className={cls.content} gap={16}>
                        <Text text={t('Главная страница')} className={cls.pageLabel} size="s" bold />
                        <Text title={t('Добро пожаловать в ATOM.BIM!')} size="l" bold />
                        <Text
                            size="m"
                            text={t(`ATOM.BIM — веб-ресурс, который содержит требования к процессу информационного моделирования,
             кадровому составу и ресурсам, задействованным в BIM-проекте, а также конечной BIM-модели`)}
                        />
                        <HStack gap={16} wrap="wrap" className={cls.metrics}>
                            <Card className={cls.metric} variant="light" border="partial_round" padding="16">
                                <Text title="EIR" text={t('единый стандарт данных')} size="s" />
                            </Card>
                            <Card className={cls.metric} variant="light" border="partial_round" padding="16">
                                <Text title="BIM" text={t('сквозной подход к модели')} size="s" />
                            </Card>
                            <Card className={cls.metric} variant="light" border="partial_round" padding="16">
                                <Text title="24/7" text={t('доступ к базе знаний')} size="s" />
                            </Card>
                        </HStack>
                    </VStack>

                    <div
                        ref={wrapperRef}
                        onMouseEnter={() => setIsHover(true)}
                        onMouseLeave={() => setIsHover(false)}
                        className={cls.imgWrapper}
                        onMouseMove={handleMove}
                    >
                        <AppImage src={mainImage} className={cls.mainImage} />
                        {isHover && (
                            <AppImage
                                src={innerImage}
                                className={cls.innerImage}
                                style={{
                                    clipPath: `circle(${circleSize / 2}px at ${position.x}px ${position.y}px)`,
                                }}
                            />
                        )}
                    </div>
                </HStack>
            </Card>
        </section>
    );
});
