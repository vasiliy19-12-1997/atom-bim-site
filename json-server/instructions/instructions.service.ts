import { InstructionArticle, InstructionNavNode } from './types';
import { InstructionsRepository } from './instructions.repository';

export class InstructionsService {
    private readonly repository: InstructionsRepository;

    constructor(repository: InstructionsRepository) {
        this.repository = repository;
    }

    public async getTree(): Promise<InstructionNavNode[]> {
        return this.repository.getTree();
    }

    public async getArticleBySlug(slug: string): Promise<InstructionArticle | null> {
        return this.repository.getArticleBySlug(slug);
    }
}
