import { Router } from "express";
import { getVideos } from "../Controllers/videoController.js";

const router = Router();

router.get("/", getVideos);
export default router;
