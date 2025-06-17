import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // ✅ Load user from localStorage when app starts
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = async ({ email, password }) => {
    try {
      // 🔐 Replace with actual logic or Firebase auth
      const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
      const foundUser = storedUsers.find(
        u => u.email === email && u.password === password
      );

      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem("user", JSON.stringify(foundUser));
        return { success: true };
      } else {
        return { success: false, error: "Invalid credentials" };
      }
    } catch (err) {
      return { success: false, error: "Login failed" };
    }
  };

  const signup = async ({ username, email, password }) => {
    try {
      const newUser = { name: username, email, password };
      const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
      const exists = storedUsers.some(u => u.email === email);

      if (exists) {
        return { success: false, error: "User already exists" };
      }

      const updatedUsers = [...storedUsers, newUser];
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      return { success: true };
    } catch (err) {
      return { success: false, error: "Signup failed" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};