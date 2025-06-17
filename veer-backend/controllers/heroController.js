import veer from "../models/Hero.js";

// GET all heroes (veers)
export const getAllHeroes = async (req, res) => {
  try {
    const heroes = await veer.find();
    res.json(heroes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching heroes", error: err.message });
  }
};

// POST a new hero
export const addHero = async (req, res) => {
  try {
    const newHero = new veer(req.body);
    await newHero.save();
    res.status(201).json({ message: "Hero added successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Error adding hero", error: err.message });
  }
};

// GET hero by ID
export const getHeroById = async (req, res) => {
  try {
    const hero = await veer.findById(req.params.id);
    if (!hero) return res.status(404).json({ message: "Hero not found" });
    res.json(hero);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};