import { memo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Page } from '@/shared/ui/deprecated/Page';
import { Text } from '@/shared/ui/redesigned/Text';
import { AppImage } from '@/shared/ui/redesigned/AppImage';
import mainImage from '../assets/licey6.jpg';
import cls from './MainPage.module.scss';
import innerImage from '../assets/licey_podl2.jpg';

const MainPage = memo(() => {
    const { t } = useTranslation();
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHover, setIsHover] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const scale = 2;
    const circleSize = 200;
    const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!wrapperRef.current) return;
        const rect = e.currentTarget.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setPosition({ x, y });
    };
    return (
        <Page data-testid="MainPage">
            {t('Главная страница')}
            <Text title={t('Добро пожаловать в Atom.BIM!')} />
            <Text
                text={t(`ATOM.BIM — веб-ресурс, который содержит требования к процессу информационного моделирования,
             кадровому составу и ресурсам, задействованным в BIM-проекте, а также конечной BIM-модели`)}
            />
            <div
                ref={wrapperRef}
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
                className={cls.imgWrapper}
                onMouseMove={handleMove}
            >
                <AppImage src={mainImage} className={cls.mainImage} />
                {isHover && (
                    <div style={{ left: position.x, top: position.y }} className={cls.circle}>
                        <AppImage
                            style={{
                                transform: `
    translate(
        -${position.x * scale - circleSize / 2}px,
        -${position.y * scale - circleSize / 2}px
    )
    scale(${scale})
`,
                            }}
                            src={innerImage}
                            className={cls.innerImage}
                        />
                    </div>
                )}
            </div>
        </Page>
    );
});

export default MainPage;
