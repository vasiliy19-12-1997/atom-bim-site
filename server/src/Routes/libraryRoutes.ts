import { Router } from "express";
import { getLibrary } from "../Controllers/libraryController.js";

const router = Router();

router.get("/", getLibrary);
export default router;
