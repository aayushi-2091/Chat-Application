import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../Auth/AuthProvider';

const Logout = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token:', token); // Log the token to verify its presence
    
    if (!token) {
      console.error('No token found, redirecting to login');
      logout(navigate);
      return;
    }

    axios.post('http://127.0.0.1:8000/api/logout', {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    .then(response => {
      fetchChats();
      logout(navigate); // clear context and navigate to /login
    })
    .catch(error => {
      console.error('Error logging out:', error);
      
      logout(navigate); // clear context and navigate to /login even if API call fails
    });
  }, [logout, navigate]);

  return null;
};

export default Logout;
