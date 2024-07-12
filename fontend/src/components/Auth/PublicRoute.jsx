import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../Auth/AuthProvider';
import Register from '../register/Register';
import Login from '../login/Login';
import 'bootstrap/dist/css/bootstrap.min.css';

const PublicRoute = () => {
  const { user, loading, wantToRegister } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border" role="status">
          <span className="sr-only"></span>
        </div>
      </div>
    );
  }

  if (user) return <Navigate to="/chat" />;

  return wantToRegister ? <Register /> : <Login />;
};

export default PublicRoute;
