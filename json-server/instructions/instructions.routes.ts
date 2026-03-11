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

const withController = (action: (resolved: InstructionsController) => Promise<void> | void) => async () => {
    const resolved = getController();
    await action(resolved);
};

export const registerInstructionRoutes = (app: JsonServerApp) => {
    app.get('/api/instructions/tree', async (req, res) => {
        try {
            await withController((resolved) => resolved.getTree(req, res))();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Instructions module init error';
            // eslint-disable-next-line no-console
            console.error(`[instructions] ${message}`);
            res.status(500).json({ message });
        }
    });

    app.get('/api/instructions/article/:slug', async (req, res) => {
        try {
            await withController((resolved) => resolved.getArticleBySlug(req, res))();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Instructions module init error';
            // eslint-disable-next-line no-console
            console.error(`[instructions] ${message}`);
            res.status(500).json({ message });
        }
    });

    app.get('/instructions/tree', async (req, res) => {
        try {
            await withController((resolved) => resolved.getTree(req, res))();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Instructions module init error';
            res.status(500).json({ message });
        }
    });

    app.get('/instructions/article/:slug', async (req, res) => {
        try {
            await withController((resolved) => resolved.getArticleBySlug(req, res))();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Instructions module init error';
            res.status(500).json({ message });
        }
    });
};
