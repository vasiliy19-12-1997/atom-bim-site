import { Router } from 'express';
import { getFaqs } from '../controllers/faqController';

const router = Router();

router.get('/', getFaqs);

export default router;
