import { prepareInstructionHtml } from './prepareInstructionHtml';

describe('prepareInstructionHtml', () => {
    it('renders markdown tables and proxies images from markdown content', () => {
        const article = {
            slug: 'bim/obshhie/sistemy-koordinat',
            contentType: 'markdown' as const,
            toc: [],
            content: [
                '## Системы координат в Revit',
                '',
                '| Система координат | Точка | Изображение |',
                '| :--- | :--- | :--- |',
                '| Координаты съёмки | Точка съёмки | ![image.png](./.files/image.png) |',
            ].join('\n'),
        };

        const prepared = prepareInstructionHtml(article);
        const container = document.createElement('div');
        container.innerHTML = prepared.html;

        const table = container.querySelector('table');
        const image = container.querySelector('img');

        expect(table).not.toBeNull();
        expect(container.querySelectorAll('th')).toHaveLength(3);
        expect(container.querySelectorAll('tbody tr')).toHaveLength(1);
        expect(image).toHaveAttribute(
            'src',
            '/api/instructions/file?slug=bim%2Fobshhie%2Fsistemy-koordinat&path=.%2F.files%2Fimage.png',
        );
    });

    it('wraps html tables and proxies relative html images', () => {
        const article = {
            slug: 'bim/obshhie/sistemy-koordinat',
            contentType: 'html' as const,
            toc: [],
            content: '<table><tr><td>Ячейка</td></tr></table><img src="./.files/schema.png" alt="schema" />',
        };

        const prepared = prepareInstructionHtml(article);
        const container = document.createElement('div');
        container.innerHTML = prepared.html;

        expect(container.querySelector('.instruction-table-wrapper table')).not.toBeNull();
        expect(container.querySelector('tbody tr td')).toHaveTextContent('Ячейка');
        expect(container.querySelector('img')).toHaveAttribute(
            'src',
            '/api/instructions/file?slug=bim%2Fobshhie%2Fsistemy-koordinat&path=.%2F.files%2Fschema.png',
        );
    });
});
