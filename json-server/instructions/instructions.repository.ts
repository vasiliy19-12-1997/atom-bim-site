import { instructionsDataSource } from './instructions.source';
import { InstructionArticle, InstructionNavNode } from './types';

export class InstructionsRepository {
    private readonly tree: InstructionNavNode[];

    private readonly articleBySlug: Map<string, InstructionArticle>;

    constructor() {
        this.tree = instructionsDataSource.tree;
        this.articleBySlug = new Map(
            instructionsDataSource.articles.map((article) => [article.slug, article]),
        );
    }

    public getTree(): InstructionNavNode[] {
        return this.tree;
    }

    public getArticleBySlug(slug: string): InstructionArticle | null {
        return this.articleBySlug.get(slug) ?? null;
    }
}
