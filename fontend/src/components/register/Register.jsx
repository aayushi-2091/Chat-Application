// Register.jsx
import React, { useState, useContext } from 'react';
import './register.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Auth/AuthProvider';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, toggleRegister } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register', {
        name,
        email,
        password,
      });
      register(response.data, navigate);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='login'>
      <h2>Create your account</h2>
      <p className='subHead'>Start chatting to people by adding them to your chats</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input id='name' type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" required />
        <label htmlFor="email">Email</label>
        <input id='email' type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />
        <label htmlFor="password">Password</label>
        <input id='password' type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" required />
        <button type="submit">Get Started</button>
      </form>
      <div className='gsign'>
        <img src="./google.svg" alt="Google Sign Up" />
        <p>Sign Up with Google</p>
      </div>
      <p>Already have an account? <span onClick={toggleRegister}>Sign In</span></p>
    </div>
  );
}

export default Register;
