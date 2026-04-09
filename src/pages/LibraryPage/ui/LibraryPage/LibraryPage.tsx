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
                <Card
                    padding="16"
                    className={cls.templateCard}
                >
                    <AppImage
                        src={LibraryImage}
                        style={{ width: '100px', height: '100px' }}
                    />
                    <Text
                        bold
                        size="s"
                        title={t('Аск_Шаблон_АР')}
                        text={`Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti aliquam, molestias aperiam eligendi nobis deleniti possimus atque doloribus soluta sit repudiandae nemo harum quidem illo nostrum temporibus exercitationem, architecto saepe odit quos ducimus reiciendis? Cumque maxime quibusdam magni iste voluptates modi facilis eos earum minima dolorem neque optio blanditiis alias aliquam unde, magnam enim nemo deserunt quaerat impedit saepe dignissimos. Sint deleniti sunt dignissimos nesciunt nemo provident totam facere impedit dolorem, ad fuga reprehenderit corporis fugit, earum possimus quidem aliquam doloribus expedita. Repellat magnam delectus quo ex, impedit, exercitationem necessitatibus velit reprehenderit consequatur nemo tempore saepe? Harum ipsa eligendi, exercitationem recusandae beatae nostrum obcaecati reprehenderit, reiciendis odit dolor voluptatibus animi facere blanditiis. Excepturi veniam obcaecati cupiditate reprehenderit in quidem ullam aut cumque officiis itaque laudantium illo quod eveniet, debitis corporis porro! Quidem omnis odio nam quae ipsum reprehenderit, minus mollitia amet dolorum, deleniti error repellendus nisi ipsam quas beatae laudantium dolores ex qui earum molestiae quasi officiis odit commodi. Nihil cum odit cupiditate et eius dolore facere iusto eaque distinctio fuga. Voluptatum incidunt dolorem amet perferendis? Ab dolorem laudantium, error minima quod voluptatibus quam, voluptate atque eius omnis ad facere et quidem eveniet nam possimus ea recusandae harum magni sed consectetur sapiente? Porro nulla ab, voluptatem amet ipsam praesentium suscipit necessitatibus unde molestiae possimus. Tempora, provident quidem doloribus blanditiis perspiciatis nobis rerum quas ea quaerat aspernatur laborum eveniet quos reprehenderit a facere, expedita consequatur deleniti! Tempora, rem. Quo cum ullam quia debitis exercitationem architecto odio, ea consequatur corporis a saepe tenetur quibusdam ipsum nobis id reprehenderit dignissimos doloribus at aut! Quaerat voluptatem odio nihil distinctio voluptates commodi quibusdam fugit sint dolores saepe id alias suscipit error, quisquam nisi dolor itaque consequuntur veritatis? Nesciunt assumenda harum accusantium. Nostrum eligendi deleniti, quisquam quidem, esse animi a nemo repellendus, magnam aspernatur doloribus dolorum.`}
                    />
                </Card>
                <Card
                    padding="16"
                    className={cls.templateCard}
                >
                    <AppImage
                        src={LibraryImage}
                        style={{ width: '100px', height: '100px' }}
                    />
                    <Text
                        bold
                        size="s"
                        title={t('Аск_Шаблон_АР')}
                    />
                </Card>
                <Card
                    padding="16"
                    className={cls.templateCard}
                >
                    <AppImage
                        src={LibraryImage}
                        style={{ width: '100px', height: '100px' }}
                    />
                    <Text
                        bold
                        size="s"
                        title={t('Аск_Шаблон_АР')}
                    />
                </Card>
                <Card
                    padding="16"
                    className={cls.templateCard}
                >
                    <AppImage
                        src={LibraryImage}
                        style={{ width: '100px', height: '100px' }}
                    />
                    <Text
                        bold
                        size="s"
                        title={t('Аск_Шаблон_АР')}
                    />
                </Card>
                <Card
                    padding="16"
                    className={cls.templateCard}
                >
                    <AppImage
                        src={LibraryImage}
                        style={{ width: '100px', height: '100px' }}
                    />
                    <Text
                        bold
                        size="s"
                        title={t('Аск_Шаблон_АР')}
                    />
                </Card>
                <Card
                    padding="16"
                    className={cls.templateCard}
                >
                    <AppImage
                        src={LibraryImage}
                        style={{ width: '100px', height: '100px' }}
                    />
                    <Text
                        bold
                        size="s"
                        title={t('Аск_Шаблон_АР')}
                    />
                </Card>
                <Card
                    padding="16"
                    className={cls.templateCard}
                >
                    <AppImage
                        src={LibraryImage}
                        style={{ width: '100px', height: '100px' }}
                    />
                    <Text
                        bold
                        size="s"
                        title={t('Аск_Шаблон_АР')}
                    />
                </Card>
            </section>
        </div>
    );
});
export default LibraryPage;
