import { EIRDocumentResponse } from './types';

const fallbackContent = `
<h1 id="eir-kask-2025-1">EIR КАСК 2025.1</h1>
<p>Документ EIR временно недоступен из исходного файла. Ниже показана резервная версия структуры.</p>
<h2 id="obshchie-polozheniya">Общие положения</h2>
<p>Раздел описывает назначение документа, область применения и ответственность участников проекта.</p>
<h3 id="terminy-i-opredeleniya">Термины и определения</h3>
<p>Единая терминология для заказчика, BIM-координатора и проектных команд.</p>
<h2 id="trebovaniya-k-modelyam">Требования к моделям</h2>
<p>Минимальные требования к структуре модели, атрибутам элементов и правилам именования.</p>
<h3 id="kontrol-kachestva-modeli">Контроль качества модели</h3>
<p>Проверки перед передачей модели: коллизии, заполненность параметров, соответствие шаблонам.</p>
`;

export const buildFallbackEirDocument = (params: {
    id: string;
    slug: string;
    title: string;
    breadcrumbs: EIRDocumentResponse['breadcrumbs'];
}): EIRDocumentResponse => ({
    id: params.id,
    slug: params.slug,
    title: params.title,
    breadcrumbs: params.breadcrumbs,
    content: fallbackContent,
    sections: [
        {
            id: 'eir-kask-2025-1',
            title: 'EIR КАСК 2025.1',
            level: 1,
            html: '<h1 id="eir-kask-2025-1">EIR КАСК 2025.1</h1><p>Документ EIR временно недоступен из исходного файла. Ниже показана резервная версия структуры.</p>',
            children: [
                {
                    id: 'obshchie-polozheniya',
                    title: 'Общие положения',
                    level: 2,
                    html: '<h2 id="obshchie-polozheniya">Общие положения</h2><p>Раздел описывает назначение документа, область применения и ответственность участников проекта.</p>',
                    children: [
                        {
                            id: 'terminy-i-opredeleniya',
                            title: 'Термины и определения',
                            level: 3,
                            html: '<h3 id="terminy-i-opredeleniya">Термины и определения</h3><p>Единая терминология для заказчика, BIM-координатора и проектных команд.</p>',
                        },
                    ],
                },
                {
                    id: 'trebovaniya-k-modelyam',
                    title: 'Требования к моделям',
                    level: 2,
                    html: '<h2 id="trebovaniya-k-modelyam">Требования к моделям</h2><p>Минимальные требования к структуре модели, атрибутам элементов и правилам именования.</p>',
                    children: [
                        {
                            id: 'kontrol-kachestva-modeli',
                            title: 'Контроль качества модели',
                            level: 3,
                            html: '<h3 id="kontrol-kachestva-modeli">Контроль качества модели</h3><p>Проверки перед передачей модели: коллизии, заполненность параметров, соответствие шаблонам.</p>',
                        },
                    ],
                },
            ],
        },
    ],
    toc: [
        { id: 'eir-kask-2025-1', title: 'EIR КАСК 2025.1', level: 1 },
        { id: 'obshchie-polozheniya', title: 'Общие положения', level: 2 },
        { id: 'terminy-i-opredeleniya', title: 'Термины и определения', level: 3 },
        { id: 'trebovaniya-k-modelyam', title: 'Требования к моделям', level: 2 },
        { id: 'kontrol-kachestva-modeli', title: 'Контроль качества модели', level: 3 },
    ],
    updatedAt: new Date().toISOString(),
});
