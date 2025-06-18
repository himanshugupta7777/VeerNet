import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "./axiosInstance";
import "./App.css";

const Heroes = () => {
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const heroesPerPage = 8;

  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        const response = await axios.get("/api/heroes");
        setHeroes(response.data);
      } catch (error) {
        setError(error.message || "Failed to load heroes");
      } finally {
        setLoading(false);
      }
    };

    fetchHeroes();
  }, []);

  const totalPages = Math.ceil(heroes.length / heroesPerPage);
  const displayedHeroes = heroes.slice(
    (currentPage - 1) * heroesPerPage,
    currentPage * heroesPerPage
  );

  const changePage = (pageNum) => setCurrentPage(pageNum);

  if (error) return <div><h2>Error</h2><p>{error}</p></div>;

  return (
    <div className="heroes-container">
      <h1 className="page-heading">Brave Heroes of the Indian Army</h1>

      {loading ? (
        <p>Loading heroes...</p>
      ) : (
        <>
          <div className="hero-grid">
            {displayedHeroes.map((hero) => (
              <div key={hero._id} className="hero-card">
                <img src={hero.image} alt={hero.name} className="hero-img" />
                <div className="hero-content">
                  <h3 className="hero-name">{hero.name}</h3>
                  <p>{hero.description?.slice(0, 100)}...</p>
                  <Link className="hero-button" to={`/heroes/${hero._id}`}>
                    Learn More
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <Pagination totalPages={totalPages} currentPage={currentPage} changePage={changePage} />
        </>
      )}
    </div>
  );
};

const Pagination = ({ totalPages, currentPage, changePage }) => (
  <div className="pagination">
    <button disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}>Prev</button>
    {[...Array(totalPages)].map((_, idx) => (
      <button
        key={idx}
        className={currentPage === idx + 1 ? "active" : ""}
        onClick={() => changePage(idx + 1)}
      >
        {idx + 1}
      </button>
    ))}
    <button disabled={currentPage === totalPages} onClick={() => changePage(currentPage + 1)}>Next</button>
  </div>
);

export default Heroes;