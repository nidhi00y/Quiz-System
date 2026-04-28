import { Router} from "express";
import { generateAIQuestions } from "../controllers/ai.js";

const router = Router();

router.get("/ai-generate", generateAIQuestions);

export default router;