import express from 'express';
import * as mammoth from 'mammoth';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import fileUpload from 'express-fileupload';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Конфигурация
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_EXTENSIONS = ['.docx', '.doc'];
const TEMP_DIR = path.join(__dirname, '../temp');
const HTML_SUBDIR = 'html_output';
const JSON_SUBDIR = 'json_output';

// Создаем необходимые директории
const htmlOutputDir = path.join(TEMP_DIR, HTML_SUBDIR);
const jsonOutputDir = path.join(TEMP_DIR, JSON_SUBDIR);

[htmlOutputDir, jsonOutputDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Создана директория: ${dir}`);
    }
});

/**
 * Middleware для проверки файла
 */
const validateWordFile = (file: fileUpload.UploadedFile) => {
    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
        throw new Error('Допустимы только файлы .docx и .doc');
    }
    
    if (file.size > MAX_FILE_SIZE) {
        throw new Error(`Максимальный размер файла: ${MAX_FILE_SIZE / 1024 / 1024}MB`);
    }
};

/**
 * Конвертация Word в HTML и сохранение JSON
 */
const convertWordToHtmlAndJson = async (filePath: string, originalFilename: string) => {
    try {
        const result = await mammoth.convertToHtml({ path: filePath });
        const filenameBase = path.parse(originalFilename).name;
        
        // Сохраняем HTML
        const htmlFilename = `${filenameBase}.html`;
        const htmlPath = path.join(htmlOutputDir, htmlFilename);
        fs.writeFileSync(htmlPath, result.value);
        
        // Создаем JSON с информацией о файле
        const jsonData = {
            originalFilename,
            htmlFilename,
            htmlContent: result.value,
            convertedAt: new Date().toISOString(),
            sizeBytes: fs.statSync(htmlPath).size,
            messages: result.messages,
            warnings: result.messages.filter(m => m.type === 'warning')
        };
        
        // Сохраняем JSON
        const jsonFilename = `${filenameBase}.json`;
        const jsonPath = path.join(jsonOutputDir, jsonFilename);
        fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2));
        
        return {
            htmlPath,
            jsonPath,
            htmlFilename,
            jsonFilename,
            htmlSize: `${(jsonData.sizeBytes / 1024).toFixed(2)} KB`,
            warnings: jsonData.warnings
        };
    } catch (error) {
        console.error('Ошибка конвертации:', error);
        throw error;
    } finally {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
};

/**
 * Загрузка нескольких файлов через API
 */
router.post('/upload-and-convert-multiple', async (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ 
                success: false,
                error: 'Необходимо загрузить файлы' 
            });
        }

        const files = Array.isArray(req.files.wordFiles) 
            ? req.files.wordFiles 
            : [req.files.wordFiles];

        const results = [];
        const errors = [];

        for (const file of files) {
            try {
                const wordFile = file as fileUpload.UploadedFile;
                validateWordFile(wordFile);

                const tempFilePath = path.join(TEMP_DIR, `${Date.now()}_${wordFile.name}`);
                await wordFile.mv(tempFilePath);

                const result = await convertWordToHtmlAndJson(tempFilePath, wordFile.name);
                
                results.push({
                    originalFilename: wordFile.name,
                    htmlFilename: result.htmlFilename,
                    jsonFilename: result.jsonFilename,
                    htmlSize: result.htmlSize,
                    warnings: result.warnings,
                    success: true
                });
            } catch (error) {
                errors.push({
                    filename: file.name,
                    error: error instanceof Error ? error.message : 'Неизвестная ошибка',
                    success: false
                });
            }
        }

        res.json({
            success: true,
            processedCount: results.length + errors.length,
            successful: results.length,
            failed: errors.length,
            results,
            errors
        });

    } catch (error) {
        console.error('Ошибка конвертации:', error);
        res.status(500).json({
            success: false,
            error: 'Ошибка при конвертации',
            details: error instanceof Error ? error.message : 'Неизвестная ошибка'
        });
    }
});

/**
 * Конвертация нескольких файлов по указанным путям
 */
router.post('/convert-multiple-by-paths', async (req, res) => {
    try {
        const { filePaths } = req.body;
        
        if (!filePaths || !Array.isArray(filePaths) || filePaths.length === 0) {
            return res.status(400).json({ 
                success: false,
                error: 'Необходимо указать массив путей к файлам' 
            });
        }

        const results = [];
        const errors = [];

        for (const filePath of filePaths) {
            try {
                const normalizedPath = path.normalize(filePath.replace(/\\/g, '/'));
                
                if (!fs.existsSync(normalizedPath)) {
                    throw new Error('Файл не найден');
                }

                const ext = path.extname(normalizedPath).toLowerCase();
                if (!ALLOWED_EXTENSIONS.includes(ext)) {
                    throw new Error('Недопустимый формат файла');
                }

                const tempFilePath = path.join(TEMP_DIR, `${Date.now()}_${path.basename(normalizedPath)}`);
                fs.copyFileSync(normalizedPath, tempFilePath);

                const result = await convertWordToHtmlAndJson(tempFilePath, path.basename(normalizedPath));

                results.push({
                    originalPath: normalizedPath,
                    htmlFilename: result.htmlFilename,
                    jsonFilename: result.jsonFilename,
                    htmlSize: result.htmlSize,
                    warnings: result.warnings,
                    success: true
                });
            } catch (error) {
                errors.push({
                    filePath,
                    error: error instanceof Error ? error.message : 'Неизвестная ошибка',
                    success: false
                });
            }
        }

        res.json({
            success: true,
            processedCount: results.length + errors.length,
            successful: results.length,
            failed: errors.length,
            results,
            errors
        });

    } catch (error) {
        console.error('Ошибка конвертации:', error);
        res.status(500).json({
            success: false,
            error: 'Ошибка при конвертации',
            details: error instanceof Error ? error.message : 'Неизвестная ошибка'
        });
    }
});

/**
 * Очистка временных файлов
 */
router.post('/cleanup', (req, res) => {
    try {
        let deletedCount = 0;

        [htmlOutputDir, jsonOutputDir].forEach(dir => {
            if (fs.existsSync(dir)) {
                fs.readdirSync(dir).forEach(file => {
                    try {
                        fs.unlinkSync(path.join(dir, file));
                        deletedCount++;
                    } catch (error) {
                        console.error(`Ошибка при удалении файла ${file}:`, error);
                    }
                });
            }
        });

        res.json({
            success: true,
            deletedCount,
            message: `Удалено ${deletedCount} временных файлов`
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Ошибка при очистке'
        });
    }
});

export default router;