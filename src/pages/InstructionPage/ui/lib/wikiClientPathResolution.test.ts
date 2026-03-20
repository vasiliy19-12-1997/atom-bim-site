import { resolveFilePath } from '../../../../../json-server/instructions/wiki.client';

describe('resolveFilePath', () => {
    it('maps bare wiki image filenames into the .files directory', () => {
        expect(resolveFilePath('bim/obshhie/sistemy-koordinat', 'image.png'))
            .toBe('/bim/obshhie/sistemy-koordinat/.files/image.png');
    });

    it('keeps explicit .files paths unchanged', () => {
        expect(resolveFilePath('bim/obshhie/sistemy-koordinat', './.files/image.png'))
            .toBe('/bim/obshhie/sistemy-koordinat/.files/image.png');
    });

    it('keeps nested relative paths unchanged', () => {
        expect(resolveFilePath('bim/obshhie/sistemy-koordinat', './assets/image.png'))
            .toBe('/bim/obshhie/sistemy-koordinat/assets/image.png');
    });
});
