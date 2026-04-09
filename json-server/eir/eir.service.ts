import { EIRRepository } from './eir.repository';
import { EIRDocumentResponse, EIRTocItem } from './types';

export class EIRService {
    private readonly repository: EIRRepository;

    constructor(repository: EIRRepository) {
        this.repository = repository;
    }

    public async getDocument(): Promise<EIRDocumentResponse> {
        return this.repository.getDocument();
    }

    public async getToc(): Promise<EIRTocItem[]> {
        const document = await this.repository.getDocument();
        return document.toc;
    }
}
