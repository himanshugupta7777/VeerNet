import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "./axiosInstance"; 
import "./App.css";

const Regiments = () => {
  const [regiments, setRegiments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const regimentsPerPage = 8;

  useEffect(() => {
    const fetchRegiments = async () => {
      try {
        const response = await axiosInstance.get("/api/regiments"); 
        setRegiments(response.data);
      } catch (error) {
        console.error("Error fetching regiments:", error);
      }
    };

    fetchRegiments();
  }, []);

  const totalPages = Math.ceil(regiments.length / regimentsPerPage);
  const displayedRegiments = regiments.slice(
    (currentPage - 1) * regimentsPerPage,
    currentPage * regimentsPerPage
  );

  return (
    <div className="regiments-container">
      <h1 className="page-heading">Indian Army Regiments</h1>
      <div className="regiment-grid">
        {displayedRegiments.map((regiment) => (
          <div key={regiment._id} className="regiment-card">
            <img
              src={regiment.image}
              alt={regiment.name}
              className="regiment-img-full"
            />
            <div className="card-content">
              <h3>{regiment.name}</h3>
              <p>{regiment.description}</p>
              <Link to={`/regiments/${regiment._id}`} className="card-button">
                Learn More
              </Link>
            </div>
          </div>
        ))}
      </div>

      <Pagination totalPages={totalPages} currentPage={currentPage} changePage={setCurrentPage} />
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

export default Regiments;