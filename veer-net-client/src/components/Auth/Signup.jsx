import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../../axiosInstance"; 
import "./AuthForm.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/auth/signup", { name, email, password }); // no baseURL needed
      localStorage.setItem("user", JSON.stringify({ name, email }));
      setMessage("Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <img
          src="https://www.pngarts.com/files/8/Army-Logo-Transparent-Image.png"
          alt="Army"
          className="auth-logo"
        />
        <h2>Join VeerNet</h2>
        {message && <p className="auth-message">{message}</p>}
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Signup</button>
        </form>
        <p style={{ color: "blue" }}>
          Already a user? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;