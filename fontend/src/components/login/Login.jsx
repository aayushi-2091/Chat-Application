import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../register/register.css';
import { AuthContext } from '../Auth/AuthProvider';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login, toggleRegister } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Reset the error state before attempting to log in
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', {
        email,
        password,
      });
      login(response.data, navigate);
    } catch (error) {
      if (error.response && error.response.status === 422) {
        // Validation error
        setError("Both fields are required.");
      } else if (error.response && error.response.status === 401) {
        // Invalid login details
        setError(error.response.data.message);
      } else {
        // Other errors
        setError("An unexpected error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className='login'>
      <h2>Welcome back!</h2>
      <p className='subHead'>Sign In to access your chats</p>
      <form onSubmit={handleLogin}>
        <label htmlFor="email">Email</label>
        <input id='email' type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />
        <label htmlFor="password">Password</label>
        <input id='password' type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required />
        <button type="submit">Sign In</button>
      </form>
      {error && <p className='error'>{error}</p>}
      
      <p>Don't have an account? <span onClick={toggleRegister}>Sign Up</span></p>
    </div>
  );
}

export default Login;
