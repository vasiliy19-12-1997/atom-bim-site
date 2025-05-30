import { Router } from 'express';
import { getWordDocuments } from '../controllers/word.controller';

const router = Router();

router.get('/', getWordDocuments);

export default router;