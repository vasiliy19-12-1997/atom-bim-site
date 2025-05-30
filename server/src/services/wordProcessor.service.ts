import mammoth from 'mammoth';
import fs from 'fs';
import path from 'path';
import { NetworkDrive } from '../utils/networkUtils';

interface WordDocument {
    fileName: string;
    htmlContent: string;
    metadata: Record<string, any>;
}

export class WordProcessor {
    private networkPath: string;
    private localTempPath: string;

    constructor(networkPath: string, localTempPath = './temp') {
        this.networkPath = networkPath;
        this.localTempPath = localTempPath;
        
        if (!fs.existsSync(this.localTempPath)) {
            fs.mkdirSync(this.localTempPath, { recursive: true });
        }
    }

    async processDocuments(): Promise<WordDocument[]> {
        try {
            await NetworkDrive.connect(this.networkPath);
            const files = fs.readdirSync(this.networkPath);
            const docxFiles = files.filter(file => file.endsWith('.docx'));

            const processedDocuments: WordDocument[] = [];
            
            for (const file of docxFiles) {
                const filePath = path.join(this.networkPath, file);
                const result = await mammoth.convertToHtml({ path: filePath });
                
                processedDocuments.push({
                    fileName: file,
                    htmlContent: result.value,
                    metadata: result.messages
                });

                // Сохраняем HTML во временную папку (опционально)
                const htmlFilePath = path.join(this.localTempPath, `${path.parse(file).name}.html`);
                fs.writeFileSync(htmlFilePath, result.value);
            }

            return processedDocuments;
        } catch (error) {
            console.error('Error processing Word documents:', error);
            throw error;
        } finally {
            await NetworkDrive.disconnect();
        }
    }

    convertToJson(documents: WordDocument[]): string {
        return JSON.stringify(documents, null, 2);
    }
}