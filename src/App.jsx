import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AllTasksPage from './pages/AllTasksPage';
import Sidebar from './components/Sidebar';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('Anonymous');
  const navigate = useNavigate();

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

  return (
    <div className="flex h-screen bg-gray-100">
      {isLoggedIn && <Sidebar username={username} onLogout={handleLogout} />}

      <div className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterPage onRegister={handleRegister} />} />

          <Route
            path="/dashboard"
            element={isLoggedIn ? <DashboardPage username={username} /> : <LoginPage onLogin={handleLogin} />}
          />
          <Route
            path="/all-tasks"
            element={isLoggedIn ? <AllTasksPage username={username} /> : <LoginPage onLogin={handleLogin} />}
          />
          {/* Tambahkan rute lain di sini nanti */}
        </Routes>
      </div>
    </div>
  );
}

export default App;