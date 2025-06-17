import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";

const Heroes = () => {
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch heroes from backend
 useEffect(() => {
  const fetchHeroes = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/heroes");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setHeroes(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  fetchHeroes();
}, []);

  if (error) {
    return (
      <div className="error-message">
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="heroes-container">
      <h1 className="page-heading">Brave Heroes of the Indian Army</h1>

      {loading ? (
        <p>Loading heroes...</p>
      ) : heroes.length === 0 ? (
        <p>No heroes found.</p>
      ) : (
        <div className="hero-grid">
          {heroes.map((hero) => (
            <div key={hero._id} className="hero-card">
              <img src={hero.image} alt={hero.name} className="hero-img" />
              <div className="hero-content">
                <h3 className="hero-name">{hero.name}</h3>
                <p className="hero-description">
                  {hero.description?.slice(0, 100)}...
                </p>
                <Link className="hero-button" to={`/heroes/${hero._id}`}>
                  Learn More
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Heroes;