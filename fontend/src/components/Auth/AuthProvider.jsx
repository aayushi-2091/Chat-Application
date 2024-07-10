// AuthProvider.jsx
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wantToRegister, setWantToRegister] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://127.0.0.1:8000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setUser(response.data))
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (userData, navigate) => {
    setUser(userData);
    localStorage.setItem('token', userData.access_token);
    navigate('/chat');
  };

  const register = (userData, navigate) => {
    setUser(userData);
    localStorage.setItem('token', userData.access_token);
    navigate('/chat');
  };

  const logout = (navigate) => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('chats');
    navigate('/login');
  };

  const toggleRegister = () => {
    setWantToRegister((prev) => !prev);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, wantToRegister, toggleRegister }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
