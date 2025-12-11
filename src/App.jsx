import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import LoginRequiredModal from './components/LoginRequiredModal.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';

import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import AllTasksPage from './pages/AllTasksPage.jsx';
import CalendarPage from './pages/CalendarPage.jsx';
import ProgressPage from './pages/ProgressPage.jsx';
import TeamPage from './pages/TeamPage.jsx';
import CategoryPage from './pages/CategoryPage.jsx';

const AppLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto ml-64 relative">
        <Outlet />
        <LoginRequiredModal />
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/all-tasks" element={<AllTasksPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/team" element={<TeamPage />} />
          
          <Route path="/shared-tasks" element={<div className="p-10 text-center text-gray-500">Shared Tasks Feature Coming Soon</div>} />
          
          {/* Dynamic Category Routes */}
          <Route path="/personal" element={<CategoryPage category="Personal" />} />
          <Route path="/work" element={<CategoryPage category="Work" />} />
          <Route path="/others" element={<CategoryPage category="Others" />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;