import { Router } from "express";
import mammoth from "mammoth";
import { UploadedFile } from "express-fileupload";
import { Request, Response } from "express";

// Расширяем тип Request
declare module "express" {
  interface Request {
    files?: {
      file: UploadedFile;
    };
  }
}

interface IListItem {
  title?: string;
  content?: string;
  children?: IListItem[];
}

const router = Router();

router.post("/upload", async (req: Request, res: Response) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ message: "Файл не загружен" });
    }

    const file = req.files.file;
    const result = await mammoth.extractRawText({ buffer: file.data });

    const parsedData = parseWordContent(result.value);
    res.status(200).json(parsedData);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при обработке файла" });
  }
});

const parseWordContent = (text: string): IListItem[] => {
  return [
    {
      title: "Раздел 1",
      content: "Содержание раздела 1",
      children: [
        {
          title: "Подраздел 1.1",
          content: "Содержание подраздела 1.1",
        },
      ],
    },
  ];
};

export default router;
