import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AllTasksPage from './pages/AllTasksPage';
import Calendar from './components/Calendar'; 
import Sidebar from './components/Sidebar';
import './index.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('Anonymous');
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setUsername(user.username || 'User');
    navigate('/dashboard');
  };

  const handleRegister = (user) => {
    setIsLoggedIn(true);
    setUsername(user.username || 'User');
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('Anonymous');
    navigate('/login');
  };

  const showSidebar = isLoggedIn && !['/login', '/register'].includes(location.pathname);

  if (showSidebar) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar username={username} onLogout={handleLogout} />
        <div className="flex-1 overflow-auto ml-64">
          <Routes>
            <Route path="/dashboard" element={<DashboardPage username={username} />} />
            <Route path="/all-tasks" element={<AllTasksPage username={username} />} />
            <Route path="/calendar" element={<Calendar />} /> 
            {/* tambahin route lain diisni */}
          </Routes>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <Routes>
        <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterPage onRegister={handleRegister} />} />
    
        <Route
          path="/dashboard"
          element={<LoginPage onLogin={handleLogin} />}
        />
        <Route
          path="/all-tasks"
          element={<LoginPage onLogin={handleLogin} />}
        />
        <Route
          path="/calendar"
          element={<LoginPage onLogin={handleLogin} />}
        />
      </Routes>
    </div>
  );
}

export default App;