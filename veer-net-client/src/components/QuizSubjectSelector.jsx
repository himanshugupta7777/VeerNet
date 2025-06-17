import React from "react";
import { useNavigate } from "react-router-dom";
import "./QuizSubjectSelector.css";

const subjects = [
  "History",
  "Geography",
  "Polity",
  "Economics",
  "English",
  "Maths",
  "Current Affairs",
];

const QuizSubjectSelector = () => {
  const navigate = useNavigate();

  const handleSelect = (subject) => {
    navigate(`/quiz/${subject}`);
  };

  return (
    <div className="quiz-selector-container">
      <h2>Select a Subject</h2>
      <div className="subject-grid">
        {subjects.map((subject) => (
          <button
            key={subject}
            className="subject-button"
            onClick={() => handleSelect(subject)}
          >
            {subject}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizSubjectSelector;