// controllers/regimentController.js

import Regiment from "../models/Regiment.js";

export const getAllRegiments = async (req, res) => {
  const regiments = await Regiment.find();
  res.json(regiments);
};

export const addRegiment = async (req, res) => {
  try {
    const newReg = new Regiment(req.body);
    await newReg.save();
    res.status(201).json({ message: "Regiment added successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Error adding regiment", error: err });
  }
};
export const getRegimentById = async (req, res) => {
  try {
    const regiment = await Regiment.findById(req.params.id);
    if (!regiment) {
      return res.status(404).json({ message: "Regiment not found" });
    }
    res.json(regiment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};