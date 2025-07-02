#!/usr/bin/env node
import axios from'axios';
import FormData from'form-data';
import fs from'fs';
import path from'path';

const API_URL = 'http://localhost:3001/api/upload-and-convert-multiple';
const FILES_DIR = 'P:/05_ОБМЕН/Коновалов/Front/test';

async function convertFiles() {
  try {
    const files = fs.readdirSync(FILES_DIR)
      .filter(file => ['.docx', '.doc'].includes(path.extname(file).toLowerCase()))
      .map(file => path.join(FILES_DIR, file));

    if (files.length === 0) {
      console.log('No Word files found in directory');
      return;
    }

    const formData = new FormData();
    files.forEach(file => {
      formData.append('wordFiles', fs.createReadStream(file));
    });

    console.log(`Converting ${files.length} files...`);
    const response = await axios.post(API_URL, formData, {
      headers: formData.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });

    console.log('Conversion results:');
    response.data.results.forEach(result => {
      console.log(`✓ ${result.originalFilename} -> ${result.htmlFilename}`);
    });

    if (response.data.errors.length > 0) {
      console.error('\nErrors:');
      response.data.errors.forEach(error => {
        console.error(`✗ ${error.filename}: ${error.error}`);
      });
    }

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

convertFiles();