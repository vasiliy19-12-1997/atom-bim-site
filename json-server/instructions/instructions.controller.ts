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

const decodeSlug = (value: string) => {
    try {
        return decodeURIComponent(value);
    } catch {
        return value;
    }
};

export class InstructionsController {
    private readonly service: InstructionsService;

    constructor(service: InstructionsService) {
        this.service = service;
    }

    public getTree = async (_req: JsonServerRequest, res: JsonServerResponse) => {
        try {
            const tree = await this.service.getTree();
            // eslint-disable-next-line no-console
            console.info('[instructions] final /api/instructions/tree payload', tree);
            res.json(tree);
        } catch (error) {
            handleError('Unable to fetch wiki tree', error, res);
        }
    };

    public getArticleBySlug = async (req: JsonServerRequest, res: JsonServerResponse) => {
        const rawSlug = req.params.slug;
        const slug = rawSlug ? decodeSlug(rawSlug) : rawSlug;

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

            // eslint-disable-next-line no-console
            console.info('[instructions] final /api/instructions/article payload', article);
            res.json(article);
        } catch (error) {
            handleError(`Unable to fetch wiki article: ${slug}`, error, res);
        }
    };

    public getFileByPath = async (req: JsonServerRequest, res: JsonServerResponse) => {
        const rawSlug = req.query?.slug;
        const rawPath = req.query?.path;
        const slug = rawSlug ? decodeSlug(rawSlug) : rawSlug;
        const filePath = rawPath ? decodeSlug(rawPath) : rawPath;

        if (!slug || !filePath) {
            res.status(400).json({ message: 'slug and path are required' });
            return;
        }

        try {
            const file = await this.service.getFileByPath(slug, filePath);

            res.setHeader('Content-Type', file.contentType);

            if (file.contentLength) {
                res.setHeader('Content-Length', file.contentLength);
            }

            if (file.cacheControl) {
                res.setHeader('Cache-Control', file.cacheControl);
            }

            if (file.fileName) {
                res.setHeader('Content-Disposition', `inline; filename="${file.fileName}"`);
            }

            res.send(file.body);
        } catch (error) {
            handleError(`Unable to fetch wiki file: ${slug} -> ${filePath}`, error, res);
        }
    };
}
