import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./App.css";

const Regiments = () => {
  console.log("Regiments component mounted ");
  const [regiments, setRegiments] = useState([]);

  useEffect(() => {
    console.log("Fetching regiments...");
    const fetchRegiments = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/regiments");
        console.log("Regiments fetched",response.data);
        setRegiments(response.data);
      } catch (error) {
        console.error("Error fetching regiments:", error);
      }
    };

    fetchRegiments();
  }, []);
    console.log("Regiment data in JSX:", regiments);
  return (
    <div className="regiments-container">
      <h1 className="page-heading">Indian Army Regiments</h1>
      <div className="regiment-grid">
        {regiments.map((regiment) => (
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
    </div>
  );
};

export default Regiments;