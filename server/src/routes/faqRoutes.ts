import { getFaq } from "controllers/faqController";
import { Router } from "express";


const router = Router();
router.get("/", getFaq);
export default router;