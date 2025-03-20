import { Request, Response } from "express";
import mammoth from "mammoth";
import fs from "fs";
import path from "path";

// Указываем путь до файла .docx на вашем компьютере
const filePath = path.join(__dirname, "..", "path", "to", "your", "file.docx");

// Функция для тестирования загрузки и обработки файла
const testUpload = async () => {
  try {
    // Читаем файл с диска
    const fileBuffer = fs.readFileSync(filePath);

    // Обрабатываем файл с помощью mammoth
    const result = await mammoth.extractRawText({ buffer: fileBuffer });

    // Выводим результат в консоль
    console.log("Результат обработки файла:", result.value);
  } catch (error) {
    console.error("Ошибка при обработке файла:", error);
  }
};

// Запускаем тест
testUpload();
