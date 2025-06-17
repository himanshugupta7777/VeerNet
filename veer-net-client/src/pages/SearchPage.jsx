import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import "../app.css";

const SearchPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");
  const [results, setResults] = useState({ heroes: [], regiments: [] });

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/search?q=${query}`);
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error("Search error:", err);
      }
    };

    if (query) fetchResults();
  }, [query]);

  return (
    <div className="search-results">
      <h2>Search Results for "{query}"</h2>

      <div className="result-group">
        <h3>Heroes</h3>
        {results.heroes.length > 0 ? (
          results.heroes.map((hero) => (
            <div key={hero._id} className="result-card">
              <Link to={`/heroes/${hero._id}`} style={{ textDecoration: 'none' }}>
                <h4>{hero.name}</h4>
              </Link>
              <p>{hero.rank} | {hero.unit}</p>
              <p>{hero.description?.slice(0, 120)}...</p>
              <div className="result-badge">Hero</div>
            </div>
          ))
        ) : (
          <p style={{color:"black"}}>No heroes found.</p>
        )}
      </div>

      <div className="result-group">
        <h3>Regiments</h3>
        {results.regiments.length > 0 ? (
          results.regiments.map((regiment) => (
            <div key={regiment._id} className="result-card">
              <Link to={`/regiments/${regiment._id}`} style={{ textDecoration: 'none' }}>
                <h4>{regiment.name}</h4>
              </Link>
              <p>{regiment.description?.slice(0, 120)}...</p>
              <div className="result-badge">Regiment</div>
            </div>
          ))
        ) : (
          <p style={{color:"black"}}>No regiments found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
