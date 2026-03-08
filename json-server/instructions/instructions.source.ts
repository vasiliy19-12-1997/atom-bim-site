import { InstructionDataSource } from './types';

const familyLoadArticleHtml = `
<h1>Загрузка семейств</h1>
<p>Эта инструкция описывает базовый сценарий подключения библиотек семейств и размещения элементов в проекте Revit.</p>

<h2>Подготовка библиотеки</h2>
<p>Перед началом убедитесь, что у вас есть доступ к сетевой папке с утвержденными семействами.</p>
<ol>
  <li>Откройте вкладку «Вставка».</li>
  <li>Нажмите «Загрузить семейство».</li>
  <li>Выберите нужную категорию и файл <code>.rfa</code>.</li>
</ol>

<h3>Рекомендуемая структура папок</h3>
<p>Разделяйте библиотеку по дисциплинам и типам изделий, чтобы сократить время поиска.</p>

<h2>Размещение и проверка параметров</h2>
<p>После загрузки семейства проверьте типоразмеры и обязательные параметры перед размещением в модели.</p>
<ol>
  <li>Выберите загруженный тип в палитре свойств.</li>
  <li>Разместите элемент на рабочем виде.</li>
  <li>Проверьте высотные отметки и привязку к уровням.</li>
</ol>

<h3>Контроль качества</h3>
<p>Перед публикацией модели выполните проверку именования и заполнения спецификационных параметров.</p>

<figure>
  <img src="https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80" alt="Пример библиотеки семейств в проекте" />
  <figcaption>Рисунок 1</figcaption>
</figure>
`;

export const instructionsDataSource: InstructionDataSource = {
    tree: [
        {
            id: 'revit-common',
            title: 'Revit Общие',
            slug: 'revit-common',
            children: [
                {
                    id: 'revit-common-zagruzka-semeystv',
                    title: 'Загрузка семейств',
                    slug: 'zagruzka-semeystv',
                },
                {
                    id: 'revit-common-dwg-underlay',
                    title: 'Использование DWG подложки',
                    slug: 'ispolzovanie-dwg-podlozhki',
                },
                {
                    id: 'revit-common-materials',
                    title: 'Материалы',
                    slug: 'materialy',
                },
            ],
        },
        {
            id: 'revit-ap',
            title: 'Revit AP',
            slug: 'revit-ap',
            children: [
                {
                    id: 'revit-ap-bazovye-nastroyki',
                    title: 'Базовые настройки вида',
                    slug: 'bazovye-nastroyki-vida',
                },
            ],
        },
        {
            id: 'revit-kzh',
            title: 'Revit КЖ',
            slug: 'revit-kzh',
            children: [
                {
                    id: 'revit-kzh-armirovanie-plit',
                    title: 'Армирование плит',
                    slug: 'armirovanie-plit',
                },
            ],
        },
    ],
    articles: [
        {
            id: 'revit-common-zagruzka-semeystv',
            title: 'Загрузка семейств',
            slug: 'zagruzka-semeystv',
            category: 'Revit Общие',
            parentCategory: 'revit-common',
            breadcrumbs: [
                { title: 'Инструкции', slug: '' },
                { title: 'Revit Общие', slug: 'revit-common' },
                { title: 'Загрузка семейств', slug: 'zagruzka-semeystv' },
            ],
            content: familyLoadArticleHtml,
            contentType: 'html',
            updatedAt: '2026-03-08T08:00:00.000Z',
            toc: [
                { id: 'podgotovka-biblioteki', title: 'Подготовка библиотеки', level: 2 },
                { id: 'rekomenduemaya-struktura-papok', title: 'Рекомендуемая структура папок', level: 3 },
                { id: 'razmeshchenie-i-proverka-parametrov', title: 'Размещение и проверка параметров', level: 2 },
                { id: 'kontrol-kachestva', title: 'Контроль качества', level: 3 },
            ],
        },
        {
            id: 'revit-common-dwg-underlay',
            title: 'Использование DWG подложки',
            slug: 'ispolzovanie-dwg-podlozhki',
            category: 'Revit Общие',
            parentCategory: 'revit-common',
            breadcrumbs: [
                { title: 'Инструкции', slug: '' },
                { title: 'Revit Общие', slug: 'revit-common' },
                { title: 'Использование DWG подложки', slug: 'ispolzovanie-dwg-podlozhki' },
            ],
            content: '<h1>Использование DWG подложки</h1><p>Черновая статья для демонстрации структуры раздела.</p>',
            contentType: 'html',
            toc: [],
        },
        {
            id: 'revit-common-materials',
            title: 'Материалы',
            slug: 'materialy',
            category: 'Revit Общие',
            parentCategory: 'revit-common',
            breadcrumbs: [
                { title: 'Инструкции', slug: '' },
                { title: 'Revit Общие', slug: 'revit-common' },
                { title: 'Материалы', slug: 'materialy' },
            ],
            content: '<h1>Материалы</h1><p>Черновая статья для демонстрации структуры раздела.</p>',
            contentType: 'html',
            toc: [],
        },
        {
            id: 'revit-ap-bazovye-nastroyki',
            title: 'Базовые настройки вида',
            slug: 'bazovye-nastroyki-vida',
            category: 'Revit AP',
            parentCategory: 'revit-ap',
            breadcrumbs: [
                { title: 'Инструкции', slug: '' },
                { title: 'Revit AP', slug: 'revit-ap' },
                { title: 'Базовые настройки вида', slug: 'bazovye-nastroyki-vida' },
            ],
            content: '<h1>Базовые настройки вида</h1><p>Черновая статья для демонстрации структуры раздела.</p>',
            contentType: 'html',
            toc: [],
        },
        {
            id: 'revit-kzh-armirovanie-plit',
            title: 'Армирование плит',
            slug: 'armirovanie-plit',
            category: 'Revit КЖ',
            parentCategory: 'revit-kzh',
            breadcrumbs: [
                { title: 'Инструкции', slug: '' },
                { title: 'Revit КЖ', slug: 'revit-kzh' },
                { title: 'Армирование плит', slug: 'armirovanie-plit' },
            ],
            content: '<h1>Армирование плит</h1><p>Черновая статья для демонстрации структуры раздела.</p>',
            contentType: 'html',
            toc: [],
        },
    ],
};
