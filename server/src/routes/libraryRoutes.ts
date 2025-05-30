import { Router } from 'express';
import { getLibraries } from '../controllers/libraryController';

const router = Router();

router.get('/', getLibraries);

export default router;