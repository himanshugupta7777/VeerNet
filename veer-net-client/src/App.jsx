import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Home";
import Regiments from "./regiments";
import Heroes from "./Heroes";
import RegimentDetail from "./RegimentDetail";
import HeroDetail from "./HeroDetail";
import Quiz from "./Quiz";
import QuizSubjectSelector from "./components/QuizSubjectSelector";
import LeaderBoard from "./LeaderBoard";
import News from "./News";
import Chatroom from "./chatroom";
import Signup from "./components/Auth/Signup";
import Login from "./components/Auth/Login";
import PrivateRoute from "./components/PrivateRoute";
import SearchPage from "./pages/SearchPage";

const App = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Routes>
      {/* Initial route logic */}
      <Route
        path="/"
        element={
          !user ? <Navigate to="/signup" replace /> : <Navigate to="/login" replace />
        }
      />

      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      <Route path="/" element={<Layout />}>
        <Route
          path="home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route path="regiments" element={<Regiments />} />
        <Route path="regiments/:id" element={<RegimentDetail />} />
        <Route path="heroes" element={<Heroes />} />
        <Route path="heroes/:id" element={<HeroDetail />} />
        <Route path="quiz" element={<QuizSubjectSelector />} />
        <Route path="quiz/:subject" element={<Quiz />} />
        <Route path="quiz/:subject/leaderboard" element={<LeaderBoard />} />
        <Route path="leaderboard/:subject" element={<Navigate to="/quiz/:subject/leaderboard" replace />} />
        <Route path="news" element={<News />} />
        <Route path="/chatroom" element={<Chatroom />} />
        
<Route path="/search" element={<SearchPage />} />

      </Route>
    </Routes>
  );
};

export default App;