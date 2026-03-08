import path from 'path';
import { EIRDocumentSource } from './types';

const DEFAULT_EIR_DOCX_PATH = 'D:\\Job\\atom\\standarts\\test\\EIR_КАСК_2025.1.docx';

export const getEirDocxPath = (): string => {
    const configuredPath = process.env.EIR_DOCX_PATH?.trim();
    if (configuredPath) {
        return configuredPath;
    }

    return DEFAULT_EIR_DOCX_PATH;
};

export const eirDocumentSource: EIRDocumentSource = {
    id: 'eir-kask-2025-1',
    title: 'EIR КАСК 2025.1',
    slug: 'eir-kask-2025-1',
    filePath: path.normalize(getEirDocxPath()),
    breadcrumbs: [
        { title: 'EIR', slug: 'eir' },
        { title: 'EIR КАСК 2025.1', slug: 'eir-kask-2025-1' },
    ],
};
