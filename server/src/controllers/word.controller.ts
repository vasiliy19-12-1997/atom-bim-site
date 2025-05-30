import { Request, Response } from 'express';
import { WordProcessor } from '../services/wordProcessor.service';

const NETWORK_PATH = 'P:\\05_ОБМЕН\\Коновалов\\Front\\test';; // Замените на ваш реальный путь
const wordProcessor = new WordProcessor(NETWORK_PATH);

export const getWordDocuments = async (req: Request, res: Response) => {
    try {
        const documents = await wordProcessor.processDocuments();
        const jsonData = wordProcessor.convertToJson(documents);
        
        res.status(200).json({
            success: true,
            data: JSON.parse(jsonData),
            htmlAvailable: true
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error processing Word documents',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};