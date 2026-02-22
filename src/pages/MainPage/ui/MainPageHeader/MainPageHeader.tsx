import { memo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppImage } from '@/shared/ui/redesigned/AppImage';
import { HStack, VStack } from '@/shared/ui/redesigned/Stack';
import { Text } from '@/shared/ui/redesigned/Text';
import mainImage from '../assets/licey6.jpg';
import innerImage from '../assets/licey_podl2.jpg';
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
    const circleSize = 200;

    const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!wrapperRef.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setPosition({ x, y });
    };

    return (
        <HStack>
            <VStack>
                {t('Главная страница')}
                <Text title={t('Добро пожаловать в Atom.BIM!')} />
                <Text
                    text={t(`ATOM.BIM — веб-ресурс, который содержит требования к процессу информационного моделирования,
             кадровому составу и ресурсам, задействованным в BIM-проекте, а также конечной BIM-модели`)}
                />
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
    );
});
