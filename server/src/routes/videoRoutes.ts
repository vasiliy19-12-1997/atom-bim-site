import { Router } from 'express';
import { getVideos } from '../controllers/videoController';

const router = Router();

router.get('/', getVideos);

export default router;