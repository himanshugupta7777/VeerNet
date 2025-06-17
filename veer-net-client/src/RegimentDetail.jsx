import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const RegimentDetail = () => {
  const { id } = useParams();
  const [regiment, setRegiment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/regiments/${id}`)
      .then((res) => {
        setRegiment(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching regiment:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p style={{ color: "white" }}>Loading...</p>;
  if (!regiment) return <p style={{ color: "white" }}>Regiment not found.</p>;

  return (
    <div className="regiment-detail" style={{ padding: "20px", color: "white" }}>
      <h1 style={{ color: "#ff9933", textAlign: "center", textShadow: "1px 1px 2px #000" }}>
        {regiment.name}
      </h1>
      <img
        src={regiment.image}
        alt={regiment.name}
        style={{
          width: "100%",
          maxHeight: "400px",
          objectFit: "cover",
          borderRadius: "12px",
          margin: "20px 0"
        }}
      />
      <p style={{ fontSize: "1.1rem", lineHeight: "1.6" ,color:"White"}}>{regiment.details}</p>

      {regiment.awards && regiment.awards.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h2 style={{ color: "#ff9933" }}>Awards</h2>
          <ul>
            {regiment.awards.map((award, index) => (
              <li key={index}>{award}</li>
            ))}
          </ul>
        </div>
      )}

      {regiment.honors && regiment.honors.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h2 style={{ color: "#ff9933" }}>Honors</h2>
          <ul>
            {regiment.honors.map((honor, index) => (
              <li key={index}>{honor}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RegimentDetail;