import { InstructionsService } from './instructions.service';
import { JsonServerRequest, JsonServerResponse } from './types';
import { WikiApiError } from './wiki.errors';

const handleError = (context: string, error: unknown, res: JsonServerResponse) => {
    if (error instanceof WikiApiError) {
        // eslint-disable-next-line no-console
        console.error(`[instructions] ${context}: ${error.message}`);
        res.status(error.status).json({ message: error.message });
        return;
    }

    const message = error instanceof Error ? error.message : 'Unexpected instructions API error';
    // eslint-disable-next-line no-console
    console.error(`[instructions] ${context}: ${message}`);
    res.status(500).json({ message });
};

export class InstructionsController {
    private readonly service: InstructionsService;

    constructor(service: InstructionsService) {
        this.service = service;
    }

    public getTree = async (_req: JsonServerRequest, res: JsonServerResponse) => {
        try {
            const tree = await this.service.getTree();
            res.json(tree);
        } catch (error) {
            handleError('Unable to fetch wiki tree', error, res);
        }
    };

    public getArticleBySlug = async (req: JsonServerRequest, res: JsonServerResponse) => {
        const { slug } = req.params;

        if (!slug) {
            res.status(400).json({ message: 'Slug is required' });
            return;
        }

        try {
            const article = await this.service.getArticleBySlug(slug);

            if (!article) {
                res.status(404).json({ message: `Instruction article "${slug}" not found` });
                return;
            }

            res.json(article);
        } catch (error) {
            handleError(`Unable to fetch wiki article: ${slug}`, error, res);
        }
    };
}
