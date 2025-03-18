import { Router } from "express";
import { getFaq } from "../Controllers/faqController.js";

const router = Router();
router.get("/", getFaq);
export default router;
