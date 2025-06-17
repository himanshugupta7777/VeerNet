import mongoose from "mongoose";

const heroSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
  description: { type: String },
  details: { type: String },
  rank: { type: String },
  unit: { type: String },
  award: { type: String },
  birthDate: { type: String }, // You can use Date type if exact parsing needed
  deathDate: { type: String },
  battles: [{ type: String }],
  quotes: [{ type: String }],
  videoLink: { type: String },
});

export default mongoose.model("veer", heroSchema);