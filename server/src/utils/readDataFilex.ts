import path from "path";
import { promises as fs } from 'fs';
const dataPath = path.join(__dirname, '../data');
export async function readDataFile(filename: string) {
  try {
    const filePath = path.join(dataPath, filename);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    throw error;
  }
}