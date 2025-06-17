import express from "express";
import { getQuizBySubject } from "../controllers/quizController.js";

const router = express.Router();

router.get("/:subject", getQuizBySubject);

export default router;