import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wantToRegister, setWantToRegister] = useState(false);

  const fetchUser = async (token) => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (otpData, navigate) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/verify-otp', otpData);
      localStorage.setItem('token', response.data.access_token);
      await fetchUser(response.data.access_token);
      navigate('/chat');
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const login = (userData, navigate) => {
    setUser(userData);
    localStorage.setItem('token', userData.access_token);
    navigate('/chat');
  };

  const register = async (userData, navigate) => {
    try {
      await axios.post('http://127.0.0.1:8000/api/register', userData);
      navigate('/verify-otp', { state: { email: userData.email } });
    } catch (error) {
      throw error;
    }
  };

  const logout = (navigate) => {
    // Clear user data from state and localStorage
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('chats');
    localStorage.removeItem('pusherTransportTLS');
    localStorage.removeItem('epr_suggested');
  
    // Clear all cookies
    clearCookies();
  
    // Navigate to login page
    navigate('/login');
  };

  const clearCookies = () => {
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    }
  };

  const toggleRegister = () => {
    setWantToRegister((prev) => !prev);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, verifyOtp, wantToRegister, toggleRegister }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
