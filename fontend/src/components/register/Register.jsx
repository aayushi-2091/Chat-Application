import React, { useState, useContext } from 'react';
import './register.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Auth/AuthProvider';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { register, toggleRegister } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register', {
        name,
        email,
        password,
      });
      navigate('/verify-otp', { state: { email } });
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data);
      } else {
        console.error(error);
      }
    }
  };

  return (
    <div className='login'>
      <h2>Create your account</h2>
      <p className='subHead'>Start chatting to people by adding them to your chats</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input id='name' type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" required />
        {errors.name && <p className="error">{errors.name[0]}</p>}
        
        <label htmlFor="email">Email</label>
        <input id='email' type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />
        {errors.email && <p className="error">{errors.email[0]}</p>}
        
        <label htmlFor="password">Password</label>
        <input id='password' type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" required />
        {errors.password && <p className="error">{errors.password[0]}</p>}
        
        <button type="submit">Get Started</button>
      </form>
      
      <p>Already have an account? <span onClick={toggleRegister}>Sign In</span></p>
    </div>
  );
}

export default Register;
