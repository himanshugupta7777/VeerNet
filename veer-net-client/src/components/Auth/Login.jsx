import React, { useState } from "react";
import axios from "../../axiosInstance"; 
import { useNavigate, Link } from "react-router-dom";
import "./AuthForm.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setMessage("Login successful!");
      setTimeout(() => navigate("/home"), 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
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
        <h2>Welcome Back, Warrior!</h2>
        {message && <p className="auth-message">{message}</p>}
        <form onSubmit={handleLogin}>
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
          <button type="submit">Login</button>
        </form>
        <p style={{color:"blue"}}>
          New user? <Link to="/signup">Signup here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;