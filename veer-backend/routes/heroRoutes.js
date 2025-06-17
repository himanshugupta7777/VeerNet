import express from "express";
import { getAllHeroes, addHero, getHeroById } from "../controllers/heroController.js";

const router = express.Router();

router.get("/", getAllHeroes);
router.post("/add", addHero);
router.get("/:id", getHeroById);

export default router;