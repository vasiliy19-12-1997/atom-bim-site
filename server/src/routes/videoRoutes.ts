import { getVideos } from "controllers/videoController";
import { Router } from "express";


const router = Router();

router.get("/", getVideos);
export default router;