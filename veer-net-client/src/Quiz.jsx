import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "./axiosInstance";
import "./Quiz.css";

const Quiz = () => {
  const { subject } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(location.state?.showCompleted || false);
  const [showReview, setShowReview] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [username, setUsername] = useState("");
  const [tempScore, setTempScore] = useState(0);
  const [weekMode, setWeekMode] = useState("current");

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        setError(null);
         console.log("Base url:",import.meta.env.VITE_API_BASE_URL);
        const res = await axiosInstance.get(`/api/quiz/${subject}?week=${weekMode}`);
        const data = res.data;

        if (!data || data.length === 0) {
          throw new Error("No questions available for this subject");
        }

        const formatted = data.map((q) => ({
          question: q.question,
          options: [q.optionA, q.optionB, q.optionC, q.optionD],
          answer: q.correct,
        }));
        setQuestions(formatted);
      } catch (err) {
        console.error("Failed to fetch quiz:", err);
        setError(err.response?.data?.error || err.message || "Failed to load quiz questions");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [subject, weekMode]);

  const currentQuestion = questions[currentIndex];

  const handleOptionChange = (opt) => {
    setAnswers({ ...answers, [currentIndex]: opt });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = () => {
    const score = questions.reduce((total, q, idx) => {
      return total + (answers[idx] === q.answer ? 1 : 0);
    }, 0);
    setTempScore(score);
    setShowNameModal(true);
  };

  const handleNameSubmit = () => {
    const nameToStore = username.trim() || "Anonymous";
    const leaderboardKey = `leaderboard_${subject}`;
    const existing = JSON.parse(localStorage.getItem(leaderboardKey)) || [];
    const updated = [...existing, { name: nameToStore, score: tempScore }];
    localStorage.setItem(leaderboardKey, JSON.stringify(updated));
    setIsSubmitted(true);
    setShowNameModal(false);
  };

  const getScore = () =>
    questions.reduce((score, q, idx) => score + (answers[idx] === q.answer ? 1 : 0), 0);

  if (loading)
    return <div className="quiz-container">Loading...</div>;

  if (error)
    return (
      <div className="quiz-container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <div className="error-actions">
            <button className="submit" onClick={() => navigate("/quiz")}>Back to Subjects</button>
            <button
              className="submit"
              onClick={() => setWeekMode(weekMode === "current" ? "all" : "current")}
              style={{ marginLeft: "10px" }}
            >
              Try {weekMode === "current" ? "All Questions" : "Current Week"}
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="quiz-container">
      {!isSubmitted && !showReview ? (
        <>
          <div className="question-card">
            <h2>{subject.toUpperCase()} Quiz</h2>
            <div className="dropdown-filter">
              <label htmlFor="weekMode">Question Mode:</label>
              <select
                id="weekMode"
                value={weekMode}
                onChange={(e) => {
                  setWeekMode(e.target.value);
                  setCurrentIndex(0);
                  setAnswers({});
                }}
              >
                <option value="current">This Week's Questions</option>
                <option value="all">All Questions</option>
              </select>
            </div>

            <h3>Question {currentIndex + 1} of {questions.length}</h3>
            <p>{currentQuestion.question}</p>
            <form>
              {currentQuestion.options.map((opt, idx) => (
                <div key={idx} className="option-line" onClick={() => handleOptionChange(opt)}>
                  <input
                    type="radio"
                    name={`question-${currentIndex}`}
                    value={opt}
                    checked={answers[currentIndex] === opt}
                    readOnly
                  />
                  <label>{opt}</label>
                </div>
              ))}
            </form>
          </div>

          <div className="btn-group">
            <button style={{ backgroundColor: "#ff6633" }} onClick={handlePrevious} disabled={currentIndex === 0}>Previous</button>
            <button style={{ backgroundColor: "#ff6633", marginLeft: "15px" }} onClick={handleNext} disabled={currentIndex === questions.length - 1}>Next</button>
            <button className="submit" onClick={handleSubmit}>Submit</button>
          </div>
        </>
      ) : showReview ? (
        <div className="review-container">
          <h2>Review Answers</h2>
          {questions.map((q, idx) => (
            <div key={idx} className="review-question">
              <p><strong>Q{idx + 1}:</strong> {q.question}</p>
              <p><strong>Your Answer:</strong> <span style={{ color: answers[idx] === q.answer ? "green" : "red", fontWeight: "bold" }}>{answers[idx] || "Not answered"}</span></p>
              {answers[idx] !== q.answer && (
                <p><strong>Correct Answer:</strong> <span style={{ color: "green", fontWeight: "bold" }}>{q.answer}</span></p>
              )}
              <hr />
            </div>
          ))}
          <div className="btn-group">
            <button className="submit" onClick={() => setShowReview(false)}>Back to Quiz Summary</button>
          </div>
        </div>
      ) : (
        <>
          <h2>Quiz Completed!</h2>
          <p style={{ color: "white", fontSize: "1.2rem", fontWeight: "bold" }}>
            Your Score: {getScore()} / {questions.length}
          </p>
          <div className="btn-group">
            <button className="submit" onClick={() => setShowReview(true)}>Review Answers</button>
            <button className="submit" onClick={() => navigate("/quiz")}>Back to Subjects</button>
            <button className="submit" onClick={() => navigate(`/quiz/${subject}/leaderboard`)}>Leaderboard</button>
          </div>
        </>
      )}

      {showNameModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Enter your name for the leaderboard</h3>
            <input
              type="text"
              placeholder="Your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <br />
            <button className="submit" onClick={handleNameSubmit}>Submit Score</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
