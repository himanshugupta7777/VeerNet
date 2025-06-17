import express from "express";
import { getAllRegiments, addRegiment } from "../controllers/regimentController.js";
import {getRegimentById} from "../controllers/regimentController.js";

const router = express.Router();

router.get("/", getAllRegiments);
router.get("/:id",getRegimentById);
router.post("/add", addRegiment);

export default router;