import mongoose from "mongoose";

const regimentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: String, // image URL
  description: String,
  details: String,
  awards: [String],
  honors: [String],
});

const Regiment = mongoose.model("Regiment", regimentSchema);

export default Regiment;