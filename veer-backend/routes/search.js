import express from "express";
import Veer from "../models/Hero.js";
import Regiment from "../models/Regiment.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const query = req.query.q?.toLowerCase();
  if (!query) return res.status(400).json({ error: "Search query is required" });

  const regex = new RegExp(query, "i"); // case-insensitive

  try {
    const heroes = await Veer.find({
      $or: [
        { name: regex },
        { rank: regex },
        { unit: regex },
        { award: regex },
        { battles: regex },
        { description: regex },
        { details: regex },
      ],
    });

    const regiments = await Regiment.find({
      $or: [
        { name: regex },
        { description: regex },
        { details: regex },
        { awards: regex },
        { honors: regex },
      ],
    });

    res.json({ heroes, regiments });
  } catch (error) {
    console.error("Search Error:", error.message);
    res.status(500).json({ error: "Something went wrong while searching" });
  }
});

export default router;