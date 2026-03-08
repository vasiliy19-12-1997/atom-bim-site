import {
    JsonServerApp,
    JsonServerRequest,
    JsonServerResponse,
} from './types';
import { InstructionsRepository } from './instructions.repository';
import { InstructionsService } from './instructions.service';

const repository = new InstructionsRepository();
const service = new InstructionsService(repository);

const sendTree = (_req: JsonServerRequest, res: JsonServerResponse) => {
    res.json(service.getTree());
};

const sendArticleBySlug = (req: JsonServerRequest, res: JsonServerResponse) => {
    const { slug } = req.params;

    if (!slug) {
        res.status(400).json({ message: 'Slug is required' });
        return;
    }

    const article = service.getArticleBySlug(slug);

    if (!article) {
        res.status(404).json({ message: `Instruction article "${slug}" not found` });
        return;
    }

    res.json(article);
};

export const registerInstructionRoutes = (app: JsonServerApp) => {
    app.get('/api/instructions/tree', sendTree);
    app.get('/api/instructions/article/:slug', sendArticleBySlug);

    // Compatibility route without /api prefix.
    app.get('/instructions/tree', sendTree);
    app.get('/instructions/article/:slug', sendArticleBySlug);
};
