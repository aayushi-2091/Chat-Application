import "./app.css";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ChatContainer from "./components/chatContainer/ChatContainer";
import Logout from "./components/logout/logout.jsx";
import AuthProvider from './components/Auth/AuthProvider.jsx';
import ProtectedRoute from './components/Auth/ProtectedRoute.jsx';
import PublicRoute from './components/Auth/PublicRoute.jsx';
import Profile from './components/profile/profile.jsx';
import Register from "./components/register/Register.jsx";
import VerifyOtp from "./components/register/VerifyOtp.jsx";

function App() {
  return (
    <div className="outerContainer">
      <div className="bg"></div>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<PublicRoute />} />
            <Route path="/register" element={<Register />} />
            <Route path="/chat" element={<ProtectedRoute><ChatContainer /></ProtectedRoute>} />
            <Route path="/logout" element={<ProtectedRoute><Logout /></ProtectedRoute>} />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
