#!/usr/bin/env node
import axios from'axios';
import FormData from'form-data';
import fs from'fs';
import path from'path';

const API_URL = 'http://localhost:3000/api/upload-and-convert-multiple';

async function convertFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error('File not found');
    }

    const formData = new FormData();
    formData.append('wordFiles', fs.createReadStream(filePath));

    console.log(`Converting ${path.basename(filePath)}...`);
    const response = await axios.post(API_URL, formData, {
      headers: formData.getHeaders()
    });

    const result = response.data.results[0];
    console.log(`Successfully converted to ${result.htmlFilename}`);
    console.log(`HTML saved to: temp/html_output/${result.htmlFilename}`);
    console.log(`JSON saved to: temp/json_output/${result.jsonFilename}`);

  } catch (error) {
    console.error('Error in single convert:', error.response?.data || error.message);
  }
}

// Получаем путь к файлу из аргументов командной строки
const filePath = process.argv[2];
if (!filePath) {
  console.log('Usage: npm run convert:single -- path/to/file.docx');
  process.exit(1);
}

convertFile(filePath);