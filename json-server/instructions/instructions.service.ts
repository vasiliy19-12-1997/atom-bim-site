import { InstructionArticle, InstructionNavNode } from './types';
import { InstructionsRepository } from './instructions.repository';

export class InstructionsService {
    private readonly repository: InstructionsRepository;

    constructor(repository: InstructionsRepository) {
        this.repository = repository;
    }

    public getTree(): InstructionNavNode[] {
        return this.repository.getTree();
    }

    public getArticleBySlug(slug: string): InstructionArticle | null {
        return this.repository.getArticleBySlug(slug);
    }
}
