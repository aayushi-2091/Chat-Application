// App.jsx
import "./app.css";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ChatContainer from "./components/chatContainer/ChatContainer";
import Logout from "./components/logout/logout.jsx";
import AuthProvider from './components/Auth/AuthProvider.jsx';
import ProtectedRoute from './components/Auth/ProtectedRoute.jsx';
import PublicRoute from './components/Auth/PublicRoute.jsx';

function App() {
  return (
    <div className="outerContainer">
      <div className="bg"></div>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<PublicRoute />} />
            <Route path="/register" element={<PublicRoute />} />
            <Route path="/chat" element={<ProtectedRoute><ChatContainer /></ProtectedRoute>} />
            <Route path="/logout" element={<ProtectedRoute><Logout /></ProtectedRoute>} />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
