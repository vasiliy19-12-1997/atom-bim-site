import { EIRService } from './eir.service';
import { JsonServerRequest, JsonServerResponse } from './types';

export class EIRController {
    private readonly service: EIRService;

    constructor(service: EIRService) {
        this.service = service;
    }

    public getDocument = async (_req: JsonServerRequest, res: JsonServerResponse) => {
        try {
            const document = await this.service.getDocument();
            res.json(document);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unexpected EIR parsing error';
            res.status(500).json({ message });
        }
    };

    public getToc = async (_req: JsonServerRequest, res: JsonServerResponse) => {
        try {
            const toc = await this.service.getToc();
            res.json(toc);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unexpected EIR TOC parsing error';
            res.status(500).json({ message });
        }
    };
}
