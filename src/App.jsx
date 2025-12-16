import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import LoginRequiredModal from './components/LoginRequiredModal'; // Import Modal Login
import DashboardPage from './pages/DashboardPage';
import AllTasksPage from './pages/AllTasksPage';
import CalendarPage from './pages/CalendarPage';
import TeamPage from './pages/TeamPage';
import CategoryPage from './pages/CategoryPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProgressPage from './pages/ProgressPage';

const App = () => {
  return (
    <div className="flex bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 ml-64 transition-all duration-300">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/all-tasks" element={<AllTasksPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/team" element={<TeamPage />} />
          
          <Route path="/personal" element={<CategoryPage category="Personal" />} />
          <Route path="/work" element={<CategoryPage category="Work" />} />
          <Route path="/others" element={<CategoryPage category="Others" />} />
        </Routes>
      </div>
      
      {/* Modal global untuk meminta login */}
      <LoginRequiredModal />
    </div>
  );
};

export default App;