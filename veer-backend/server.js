import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

// Route imports
import regimentRoutes from "./routes/regimentRoutes.js";
import heroRoutes from "./routes/heroRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import newsRoute from "./routes/news.js";
import authRoutes from "./routes/authRoutes.js"; 
import searchRoute from "./routes/search.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/regiments", regimentRoutes);
app.use("/api/heroes", heroRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/news", newsRoute);
app.use("/api/auth", authRoutes); 
app.use("/api/search", searchRoute);


// Root
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(PORT, () => {
  console.log(` Server started on port ${PORT}`);
});