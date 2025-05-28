import { Router } from 'express';
import { getFaq } from '../controllers/faqController';

const router = Router();
 
router.get('/', getFaq);

export default router;