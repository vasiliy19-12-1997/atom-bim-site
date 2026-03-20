import {
    JsonServerApp,
} from './types';
import { InstructionsRepository } from './instructions.repository';
import { InstructionsService } from './instructions.service';
import { InstructionsController } from './instructions.controller';
import { YandexWikiClient } from './wiki.client';
import { WikiApiError } from './wiki.errors';

let controller: InstructionsController | null = null;
let initError: WikiApiError | null = null;

const getController = () => {
    if (controller) {
        return controller;
    }

    if (initError) {
        throw initError;
    }

    try {
        const client = new YandexWikiClient();
        const repository = new InstructionsRepository(client);
        const service = new InstructionsService(repository);
        controller = new InstructionsController(service);
        return controller;
    } catch (error) {
        if (error instanceof WikiApiError) {
            initError = error;
            throw error;
        }

        const wrapped = new WikiApiError('Unable to initialize Yandex Wiki client', 500);
        initError = wrapped;
        throw wrapped;
    }
};

const resolveError = (error: unknown): { status: number; message: string } => {
    if (error instanceof WikiApiError) {
        return { status: error.status, message: error.message };
    }

    return {
        status: 500,
        message: error instanceof Error ? error.message : 'Instructions module init error',
    };
};

export const registerInstructionRoutes = (app: JsonServerApp) => {
    try {
        getController();
    } catch (error) {
        const { message } = resolveError(error);
        // eslint-disable-next-line no-console
        console.error(`[instructions] startup: ${message}`);
    }


    app.get('/api/instructions', async (req, res) => {
        try {
            await getController().getTree(req, res);
        } catch (error) {
            const { status, message } = resolveError(error);
            // eslint-disable-next-line no-console
            console.error(`[instructions] ${message}`);
            res.status(status).json({ message });
        }
    });

    app.get('/api/instructions/tree', async (req, res) => {
        try {
            await getController().getTree(req, res);
        } catch (error) {
            const { status, message } = resolveError(error);
            // eslint-disable-next-line no-console
            console.error(`[instructions] ${message}`);
            res.status(status).json({ message });
        }
    });

    app.get('/api/instructions/article/:slug', async (req, res) => {
        try {
            await getController().getArticleBySlug(req, res);
        } catch (error) {
            const { status, message } = resolveError(error);
            // eslint-disable-next-line no-console
            console.error(`[instructions] ${message}`);
            res.status(status).json({ message });
        }
    });

    app.get('/api/instructions/file', async (req, res) => {
        try {
            await getController().getFileByPath(req, res);
        } catch (error) {
            const { status, message } = resolveError(error);
            // eslint-disable-next-line no-console
            console.error(`[instructions] ${message}`);
            res.status(status).json({ message });
        }
    });

    app.get('/instructions/tree', async (req, res) => {
        try {
            await getController().getTree(req, res);
        } catch (error) {
            const { status, message } = resolveError(error);
            res.status(status).json({ message });
        }
    });

    app.get('/instructions/article/:slug', async (req, res) => {
        try {
            await getController().getArticleBySlug(req, res);
        } catch (error) {
            const { status, message } = resolveError(error);
            res.status(status).json({ message });
        }
    });

    app.get('/instructions/file', async (req, res) => {
        try {
            await getController().getFileByPath(req, res);
        } catch (error) {
            const { status, message } = resolveError(error);
            res.status(status).json({ message });
        }
    });
};
