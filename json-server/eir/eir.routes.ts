import { EIRController } from './eir.controller';
import { EIRRepository } from './eir.repository';
import { EIRService } from './eir.service';
import { JsonServerApp } from './types';

const repository = new EIRRepository();
const service = new EIRService(repository);
const controller = new EIRController(service);

export const registerEirRoutes = (app: JsonServerApp) => {
    app.get('/api/eir/document', controller.getDocument);
    app.get('/api/eir/toc', controller.getToc);

    // Compatibility routes without /api prefix.
    app.get('/eir/document', controller.getDocument);
    app.get('/eir/toc', controller.getToc);
};
