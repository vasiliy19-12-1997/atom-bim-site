import { resolveFilePath, resolveFilePathCandidates } from '../../../../../json-server/instructions/wiki.client';

describe('resolveFilePathCandidates', () => {
    it('tries both direct and .files paths for bare wiki image filenames', () => {
        expect(resolveFilePathCandidates('bim/obshhie/sistemy-koordinat', 'image.png'))
            .toEqual([
                '/bim/obshhie/sistemy-koordinat/image.png',
                '/bim/obshhie/sistemy-koordinat/.files/image.png',
            ]);
    });

    it('keeps explicit .files paths unchanged', () => {
        expect(resolveFilePathCandidates('bim/obshhie/sistemy-koordinat', './.files/image.png'))
            .toEqual(['/bim/obshhie/sistemy-koordinat/.files/image.png']);
    });

    it('keeps nested relative paths unchanged', () => {
        expect(resolveFilePathCandidates('bim/obshhie/sistemy-koordinat', './assets/image.png'))
            .toEqual(['/bim/obshhie/sistemy-koordinat/assets/image.png']);
    });
});

describe('resolveFilePath', () => {
    it('keeps the first candidate as the default resolved path', () => {
        expect(resolveFilePath('bim/obshhie/sistemy-koordinat', 'image.png'))
            .toBe('/bim/obshhie/sistemy-koordinat/image.png');
    });
});
