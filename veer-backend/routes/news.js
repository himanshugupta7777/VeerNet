import express from 'express';
import axios from 'axios';
const router = express.Router();

const NEWS_API_KEY = process.env.NEWS_API_KEY;

router.get('/', async (req, res) => {
  const category = req.query.category || 'defence'; // default search term

  try {
    console.log("News api key in use ",NEWS_API_KEY);
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: category,
        language: 'en',
        sortBy: 'publishedAt',
        apiKey: NEWS_API_KEY,
      },
    });

    console.log(`✅ Articles fetched for '${category}': ${response.data.articles.length}`);
    res.json(response.data.articles); // Send back articles array
  } catch (error) {
    console.error("❌ Error fetching news:", error.message);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

export default router;
