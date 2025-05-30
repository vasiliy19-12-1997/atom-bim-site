import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import lockfile from 'proper-lockfile';
import { Mutex } from 'async-mutex';

interface NetworkDriveOptions {
    driveLetter?: string;
    username?: string;
    password?: string;
    persistent?: boolean;
    readOnly?: boolean;
    timeout?: number;
}

interface FileOperationResult {
    success: boolean;
    message: string;
    error?: Error;
}

export class NetworkDrive {
    private static mutex = new Mutex();
    private static operationTimeout = 30000; // 30 секунд

    /**
     * Безопасно подключает сетевой диск
     */
    static async connect(networkPath: string, options: NetworkDriveOptions = {}): Promise<FileOperationResult> {
        const release = await this.mutex.acquire();
        
        try {
            if (this.isConnected(networkPath, options.driveLetter)) {
                return {
                    success: true,
                    message: `Сетевая папка уже подключена: ${networkPath}`
                };
            }

            let command = `net use`;
            if (options.driveLetter) command += ` ${options.driveLetter}:`;
            command += ` "${this.normalizePath(networkPath)}"`;

            if (options.password) {
                command += ` ${options.password}`;
                if (options.username) command += ` /user:${options.username}`;
            }

            if (options.readOnly) command += ' /READONLY';
            if (options.persistent) command += ' /persistent:yes';

            console.log(`Подключение: ${command.replace(options.password ? options.password : '', '*****')}`);
            
            execSync(command, { 
                stdio: 'ignore',
                timeout: options.timeout || this.operationTimeout 
            });

            if (!this.isConnected(networkPath, options.driveLetter)) {
                throw new Error(`Не удалось проверить подключение после команды`);
            }

            return {
                success: true,
                message: `Сетевая папка успешно подключена: ${networkPath}`
            };
        } catch (error) {
            const err = error instanceof Error ? error : new Error(String(error));
            return {
                success: false,
                message: `Ошибка подключения: ${networkPath}`,
                error: err
            };
        } finally {
            release();
        }
    }

    /**
     * Безопасно отключает сетевой диск
     */
    static async disconnect(target: string): Promise<FileOperationResult> {
        const release = await this.mutex.acquire();
        
        try {
            if (!this.isConnected(target)) {
                return {
                    success: true,
                    message: `Сетевая папка уже отключена: ${target}`
                };
            }

            const command = `net use "${this.normalizePath(target)}" /delete /y`;
            console.log(`Отключение: ${command}`);
            
            execSync(command, { 
                stdio: 'ignore',
                timeout: this.operationTimeout 
            });

            return {
                success: true,
                message: `Сетевая папка отключена: ${target}`
            };
        } catch (error) {
            const err = error instanceof Error ? error : new Error(String(error));
            return {
                success: false,
                message: `Ошибка отключения: ${target}`,
                error: err
            };
        } finally {
            release();
        }
    }

    /**
     * Безопасное чтение содержимого папки
     */
    static async readDir(dirPath: string): Promise<{success: boolean; files?: string[]; error?: Error}> {
        try {
            if (!this.isConnected(dirPath)) {
                throw new Error(`Папка не подключена: ${dirPath}`);
            }

            const release = await lockfile.lock(dirPath, {
                retries: {
                    retries: 3,
                    factor: 2,
                    minTimeout: 1000,
                    maxTimeout: 5000
                }
            });

            try {
                const files = fs.readdirSync(dirPath);
                return {
                    success: true,
                    files: files.filter(f => !f.startsWith('~$')) // Игнорируем временные файлы Word
                };
            } finally {
                await release();
            }
        } catch (error) {
            const err = error instanceof Error ? error : new Error(String(error));
            return {
                success: false,
                error: err
            };
        }
    }

    /**
     * Безопасное чтение файла
     */
    static async readFile(filePath: string): Promise<{success: boolean; data?: Buffer; error?: Error}> {
        try {
            const dirPath = path.dirname(filePath);
            const dirContent = await this.readDir(dirPath);
            
            if (!dirContent.success || !dirContent.files?.includes(path.basename(filePath))) {
                throw new Error(`Файл не найден: ${filePath}`);
            }

            const release = await lockfile.lock(filePath, {
                retries: {
                    retries: 5,
                    factor: 2,
                    minTimeout: 1000,
                    maxTimeout: 10000
                }
            });

            try {
                const data = fs.readFileSync(filePath);
                return { success: true, data };
            } finally {
                await release();
            }
        } catch (error) {
            const err = error instanceof Error ? error : new Error(String(error));
            return {
                success: false,
                error: err
            };
        }
    }

    /**
     * Проверка подключения сетевой папки
     */
    static isConnected(networkPath: string, driveLetter?: string): boolean {
        try {
            const output = execSync('net use', { encoding: 'utf-8' });
            
            if (driveLetter) {
                const drive = driveLetter.toUpperCase() + ':';
                return output.includes(drive) && 
                      (output.includes(networkPath) || output.includes(this.normalizePath(networkPath)));
            }
            
            return output.includes(networkPath) || output.includes(this.normalizePath(networkPath));
        } catch {
            return false;
        }
    }

    /**
     * Нормализация пути для Windows
     */
    private static normalizePath(p: string): string {
        return p.replace(/\//g, '\\');
    }

    /**
     * Создает временную копию файла для безопасной обработки
     */
    static async createTempCopy(sourcePath: string, tempDir: string): Promise<string> {
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        const fileName = path.basename(sourcePath);
        const tempPath = path.join(tempDir, `${Date.now()}_${fileName}`);

        const fileContent = await this.readFile(sourcePath);
        if (!fileContent.success || !fileContent.data) {
            throw fileContent.error || new Error('Не удалось прочитать файл');
        }

        fs.writeFileSync(tempPath, fileContent.data);
        return tempPath;
    }
}

// Дополнительные утилиты для работы с файлами
export class FileUtils {
    /**
     * Безопасная проверка файла перед обработкой
     */
    static async isFileSafe(filePath: string): Promise<boolean> {
        try {
            await fs.promises.access(filePath, fs.constants.R_OK);
            const stats = await fs.promises.stat(filePath);
            
            // Файл не должен быть изменен в последние 5 секунд
            return Date.now() - stats.mtimeMs > 5000;
        } catch {
            return false;
        }
    }

    /**
     * Атомарная замена файла
     */
    static async atomicReplace(originalPath: string, newPath: string): Promise<void> {
        const backupPath = `${originalPath}.backup`;
        
        try {
            // 1. Создаем backup
            await fs.promises.rename(originalPath, backupPath);
            
            // 2. Перемещаем новый файл
            await fs.promises.rename(newPath, originalPath);
            
            // 3. Удаляем backup
            await fs.promises.unlink(backupPath);
        } catch (error) {
            // Восстанавливаем из backup при ошибке
            if (fs.existsSync(backupPath)) {
                await fs.promises.rename(backupPath, originalPath);
            }
            throw error;
        }
    }
}