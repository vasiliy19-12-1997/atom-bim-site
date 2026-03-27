import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { classNames } from '@/shared/lib/classNames/classNames';
import cls from './LibraryPage.module.scss';
import { Text } from '@/shared/ui/redesigned/Text';
import { ArticlePageTabs } from '@/features/ArticlePageTabs';
import { ArticleType } from '@/entities/Article';
import { Card } from '@/shared/ui/redesigned/Card';
import { AppImage } from '@/shared/ui/redesigned/AppImage';
import LibraryImage from '@/shared/assets/images/library.png';

interface LibraryPageProps {
    className?: string;
}

const LibraryPage = memo((props: LibraryPageProps) => {
    const { className } = props;
    const { t } = useTranslation();

    return (
        <div className={classNames(cls.LibraryPage, {}, [className])}>
            <header className={cls.header}>
                <Text title={t('Library Page')} />
            </header>
            <ArticlePageTabs
                value={ArticleType.ALL}
                // eslint-disable-next-line react/jsx-no-bind
                onChangeType={function (value: ArticleType): void {
                    throw new Error('Function not implemented.');
                }}
            />
            <Text
                size="m"
                title={t('Шаблоны для Revit')}
            />
            <section className={cls.Templates}>
                <Card className={cls.templateCard}>
                    <AppImage
                        src={LibraryImage}
                        style={{ width: '100px', height: '100px' }}
                    />
                    <Text
                        bold
                        size="s"
                        text={t('Аск_Шаблон_АР')}
                    />
                </Card>
                <Card className={cls.templateCard}>
                    <AppImage
                        src={LibraryImage}
                        style={{ width: '100px', height: '100px' }}
                    />
                    <Text
                        bold
                        size="s"
                        text={t('Аск_Шаблон_АР')}
                    />
                </Card>
                <Card className={cls.templateCard}>
                    <AppImage
                        src={LibraryImage}
                        style={{ width: '100px', height: '100px' }}
                    />
                    <Text
                        bold
                        size="s"
                        text={t('Аск_Шаблон_АР')}
                    />
                </Card>
                <Card className={cls.templateCard}>
                    <AppImage
                        src={LibraryImage}
                        style={{ width: '100px', height: '100px' }}
                    />
                    <Text
                        bold
                        size="s"
                        text={t('Аск_Шаблон_АР')}
                    />
                </Card>
                <Card className={cls.templateCard}>
                    <AppImage
                        src={LibraryImage}
                        style={{ width: '100px', height: '100px' }}
                    />
                    <Text
                        bold
                        size="s"
                        text={t('Аск_Шаблон_АР')}
                    />
                </Card>
                <Card className={cls.templateCard}>
                    <AppImage
                        src={LibraryImage}
                        style={{ width: '100px', height: '100px' }}
                    />
                    <Text
                        bold
                        size="s"
                        text={t('Аск_Шаблон_АР')}
                    />
                </Card>
                <Card className={cls.templateCard}>
                    <AppImage
                        src={LibraryImage}
                        style={{ width: '100px', height: '100px' }}
                    />
                    <Text
                        bold
                        size="s"
                        text={t('Аск_Шаблон_АР')}
                    />
                </Card>
            </section>
        </div>
    );
});
export default LibraryPage;
