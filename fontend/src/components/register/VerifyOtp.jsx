import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../Auth/AuthProvider';
import './register.css';

function VerifyOtp() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state;
  const { verifyOtp } = useContext(AuthContext);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await verifyOtp({ email, otp }, navigate);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className='login'>
      <h2>Verify OTP</h2>
      <p className='subHead'>Enter the OTP sent to your email</p>
      <form onSubmit={handleVerifyOtp}>
        <label htmlFor="otp">OTP</label>
        <input id='otp' type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" required />
        <button type="submit">Verify</button>
      </form>
      {error && <p className='error'>{error}</p>}
    </div>
  );
}

export default VerifyOtp;
