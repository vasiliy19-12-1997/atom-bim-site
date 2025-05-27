import { getLibrary } from "controllers/libraryController";
import { Router } from "express";


const router = Router();

router.get("/", getLibrary);
export default router;