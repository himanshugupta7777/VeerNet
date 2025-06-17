import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Quiz.css";

const ITEMS_PER_PAGE = 5;

const LeaderBoard = () => {
  const { subject } = useParams();
  const navigate = useNavigate();
  const leaderboardKey = `leaderboard_${subject}`;
  const fullLeaderboard = JSON.parse(localStorage.getItem(leaderboardKey)) || [];

  const sorted = fullLeaderboard.sort((a, b) => b.score - a.score);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleScores = sorted.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="quiz-container">
      <h2>{subject} Leaderboard</h2>

      {sorted.length === 0 ? (
        <p>No scores submitted yet.</p>
      ) : (
        <>
          <ol className="leaderboard-list" start={startIndex + 1}>
            {visibleScores.map((entry, index) => (
              <li key={index}>
                <strong>#{startIndex + index + 1}</strong>
                <span className="username">{entry.name}</span>
                <span className="score">{entry.score}</span>
              </li>
            ))}
          </ol>

          <div className="btn-group">
            <button
              className="submit"
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <button
              style={{ marginLeft: "5px" }}
              className="submit"
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}

      <div className="btn-group" style={{ marginTop: "20px" }}>
        <button className="submit" onClick={() => navigate("/quiz")}>
          Back to Subjects
        </button>
        <button
          className="submit" 
          style={{marginLeft:"5px"}}
          onClick={() => navigate(`/quiz/${subject}`, { state: { showCompleted: true } })}
        >
          Back to Quiz Summary
        </button>
      </div>
    </div>
  );
};

export default LeaderBoard;
