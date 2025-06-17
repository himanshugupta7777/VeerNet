// Home.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Medal,
  BookOpenCheck,
  Newspaper,
  MessageSquare
} from "lucide-react";
import "./App.css";

const images = [
  "indian-army-day-slide1 (1).png",
  "tank.jpg",
  "sports-run (1).jpg",
  "join.jpg",
  "operations.jpg",
  "leadership.jpg",
  "water.jpg"
];

const Home = () => {
  const navigate = useNavigate(); // ✅ move inside function

  const [currentIndex, setCurrentIndex] = useState(0);
  const slideInterval = useRef(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const resetInterval = () => {
    if (slideInterval.current) clearInterval(slideInterval.current);
    slideInterval.current = setInterval(nextSlide, 3000);
  };

  useEffect(() => {
    slideInterval.current = setInterval(nextSlide, 3000);
    return () => clearInterval(slideInterval.current);
  }, []);

  useEffect(() => {
    resetInterval();
  }, [currentIndex]);

  const cards = [
    {
      title: "Explore Regiments",
      icon: (
        <img
          src="https://cdn1.iconfinder.com/data/icons/military-filled/64/army-33-1024.png"
          alt="military-helmet"
          style={{ width: "48px", height: "48px", color: "lightgreen" }}
        />
      ),
      description: "Dive into the history, valor, and stories of Indian Army regiments.",
      onClick: () => navigate("/regiments") // ✅ handled properly
    },
    {
      title: "National Heroes",
      icon: <Medal size={48} color="lightgreen" />,
      description: "Learn about the brave heroes who shaped our nation's defense legacy.",
      link: "/heroes"
    },
    {
      title: "Quiz Zone",
      icon: <BookOpenCheck size={48} color="lightgreen" />,
      description: "Test your knowledge on defense, history, and current affairs.",
      link: "/quiz"
    },
    {
      title: "News",
      icon: <Newspaper size={48} color="lightgreen" />,
      description: "Stay updated with latest Indian Army operations and defense news.",
      link: "/news"
    },
    {
      title: "Chatroom",
      icon: <MessageSquare size={48} color="lightgreen" />,
      description: "Engage with fellow aspirants, share thoughts, and ask questions.",
      link: "/chatroom"
    }
  ];

  return (
    <section className="hero-section">
      <div className="hero-card">
        {/* Slideshow */}
        <div className="slideshow-container">
          <div className="text-overlay">
            This platform helps you explore the valour of Indian Army regiments,
            learn about our national heroes, stay updated with real-time defence news,
            test your knowledge through quizzes, and connect with fellow CDS/NDA aspirants — all in one place.
          </div>

          <button className="arrow left-arrow" onClick={prevSlide}>
            &#10094;
          </button>
          <img
            src={images[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            className="slide-image"
          />
          <button className="arrow right-arrow" onClick={nextSlide}>
            &#10095;
          </button>
        </div>

        {/* Feature Cards */}
        <div className="card-section">
          {cards.map((card, index) => (
            <div key={index} className="feature-card">
              <div className="icon-wrapper">{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              {card.onClick ? (
                <button className="card-button" onClick={card.onClick}>
                  Explore
                </button>
              ) : (
                <a href={card.link} className="card-button">
                  Explore
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home;