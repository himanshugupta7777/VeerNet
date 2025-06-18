import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaYoutube } from "react-icons/fa"; // YouTube icon from react-icons
import axios from "./axiosInstance"; // Make sure the path is correct relative to this file

const HeroDetail = () => {
  const { id } = useParams();
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await axios.get(`/api/heroes/${id}`);
        const data = res.data; 
        setHero(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch hero:", err);
        setLoading(false);
      }
    };

    fetchHero();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!hero) return <p>Hero not found</p>;

  return (
    <div className="hero-detail-container" style={{ color: "white", padding: "2rem" }}>
      <h1>{hero.name}</h1>
      <img
        src={hero.image}
        alt={hero.name}
        className="hero-image-large"
        style={{ maxWidth: "100%", borderRadius: "10px" }}
      />

      <div className="hero-info" style={{ marginTop: "1rem" }}>
        {hero.rank && <p><strong>Rank:</strong> {hero.rank}</p>}
        {hero.unit && <p><strong>Unit:</strong> {hero.unit}</p>}
        {hero.award && <p><strong>Award:</strong> {hero.award}</p>}
        {hero.birthDate && <p><strong>Born:</strong> {hero.birthDate}</p>}
        {hero.deathDate && <p><strong>Martyrdom:</strong> {hero.deathDate}</p>}
        {hero.battles?.length > 0 && (
          <p><strong>Battles:</strong> {hero.battles.join(", ")}</p>
        )}
      </div>

      <p style={{ marginTop: "1rem", lineHeight: "1.6" }}>{hero.details}</p>

      {hero.quotes?.length > 0 && (
        <blockquote style={{
          marginTop: "1rem",
          fontStyle: "italic",
          borderLeft: "3px solid #ccc",
          paddingLeft: "1rem"
        }}>
          “{hero.quotes[0]}”
        </blockquote>
      )}

      {hero.videoLink && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Watch Tribute</h3>
          <a
            href={hero.videoLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              color: "#FF0000",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "18px",
              marginTop: "8px"
            }}
          >
            <FaYoutube style={{ marginRight: "8px", fontSize: "24px" }} />
            YouTube Link
          </a>
        </div>
      )}
    </div>
  );
};

export default HeroDetail;