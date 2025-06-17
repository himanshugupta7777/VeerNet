import React, { useState, useEffect, useRef } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import "./App.css";

const Layout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
      setSearchTerm("");
    }
  };

  return (
    <div className="veer-net">
      <div className="main-container">
        {/* Navbar */}
        <header className="navbar inside-card-navbar">
          <div className="container">
            <div className="logo-section">
              <img
                src="https://www.pngarts.com/files/8/Army-Logo-Transparent-Image.png"
                alt="Logo"
                className="logo-img"
              />
              <span className="logo-text">
                JOIN INDIAN ARMY
                <hr className="hr" />
                <div className="govt">GOVERNMENT OF INDIA</div>
              </span>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="search-bar">
              <input
                type="text"
                placeholder="Search Regiments, Heroes"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit">Search</button>
            </form>

            <div className="Satyamev">
              <img
                src="https://w0.peakpx.com/wallpaper/1018/1009/HD-wallpaper-emlem-emblem-indian-king-ashoka-lion-proud-satyamev-jayate.jpg"
                alt="satya"
                className="satya-logo"
              />
            </div>
          </div>
        </header>

        {/* Profile section */}
        {user && (
          <div className="profile-floating" ref={dropdownRef}>
            <div className="user-trigger" onClick={toggleDropdown}>
              <img
                src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                alt="Profile"
                className="profile-avatar"
              />
              <span className="profile-name">{user.name}</span>
            </div>

            {showDropdown && (
              <div className="dropdown-menu-user">
                <p><span>Name:</span> {user.name}</p>
                <p><span>Email:</span> {user.email}</p>
                <hr />
                <button
                  onClick={handleLogout}
                  className="dropdown-item-user logout-btn"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <nav className="mid-navbar">
          <div className="container">
            <ul className="nav-links">
              <li><Link to="/home">Home</Link></li>
              <li className="dropdown">
                <span>Regiments & Heroes</span>
                <ul className="dropdown-menu">
                  <li><Link to="/regiments">Regiments</Link></li>
                  <li><Link to="/heroes">Heroes</Link></li>
                </ul>
              </li>
              <li><Link to="/quiz">Quizzes & Scores</Link></li>
              <li><Link to="/news">News</Link></li>
              <li><Link to="/chatroom">Community Chatroom</Link></li>
            </ul>
          </div>
        </nav>

        {/* Main content */}
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;