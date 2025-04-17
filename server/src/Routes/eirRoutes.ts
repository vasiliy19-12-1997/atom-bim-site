import { Router } from "express";

interface IListItem {
  title?: string;
  content?: string;
  children?: IListItem[];
}

const router = Router();

export default router;
