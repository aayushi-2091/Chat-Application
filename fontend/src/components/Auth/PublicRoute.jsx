// PublicRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../Auth/AuthProvider';
import Register from '../register/Register';
import Login from '../login/Login';

const PublicRoute = () => {
  const { user, loading, wantToRegister } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  if (user) return <Navigate to="/chat" />;

  return wantToRegister ? <Register /> : <Login />;
};

export default PublicRoute;
