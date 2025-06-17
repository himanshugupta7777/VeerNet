import React, { useEffect, useState } from "react";
import "./News.css";
import axios from "axios";

const News = () => {
  const [newsData, setNewsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("defence");
  const [expandedNews, setExpandedNews] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    try {
      const res = await axios.get(`/api/news?category=${selectedCategory}`);
      // console.log("API response:", res.data);
      setNewsData(res.data);
    } catch (err) {
      console.error("Failed to fetch news:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [selectedCategory]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setLoading(true);
  };

  const toggleReadMore = (idx) => {
    setExpandedNews((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const categories = ["defence", "politics", "economy", "modi", "education", "sports", "technology"];

  const filteredNews = (Array.isArray(newsData) ? newsData : [])
    .filter(
      (news) =>
        news.title?.toLowerCase().includes(searchTerm) ||
        news.description?.toLowerCase().includes(searchTerm)
    )
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  return (
    <div className="news-container">
      <h2 className="news-heading">Latest News</h2>

      <div className="news-controls">
        <input
          type="text"
          placeholder="Search news..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />

        <select
          className="category-select"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading news...</p>
      ) : filteredNews.length === 0 ? (
        <p className="no-news">No news found.</p>
      ) : (
        <div className="news-list">
          {filteredNews.map((news, idx) => (
            <div key={idx} className="news-card">
              {news.urlToImage && (
                <img src={news.urlToImage} alt="news" className="news-image" />
              )}
              <div className="news-content">
                <h3>{news.title}</h3>
                <p className="news-date">
                  {new Date(news.publishedAt).toLocaleDateString()} |{" "}
                  <em>{news.source?.name}</em>
                </p>
                <p className="news-text">
                  {expandedNews[idx]
                    ? news.description
                    : news.description?.slice(0, 200) + "..."}
                </p>
                <a
                  href={news.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="read-more-btn"
                >
                  Read Full Article
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default News;