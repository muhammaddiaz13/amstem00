import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import LoginRequiredModal from './components/LoginRequiredModal';
import DashboardPage from './pages/DashboardPage';
import AllTasksPage from './pages/AllTasksPage';
import CalendarPage from './pages/CalendarPage';
import TeamPage from './pages/TeamPage';
import CategoryPage from './pages/CategoryPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProgressPage from './pages/ProgressPage';

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Hide mobile header on login/register pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      
      {/* Mobile Header (Visible only on mobile/tablet) */}
      {!isAuthPage && (
        <div className="md:hidden fixed top-0 left-0 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-30 px-4 py-3 flex items-center justify-between shadow-sm transition-colors duration-300">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
          
          <div className="flex items-center gap-2">
             <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">A</div>
             <span className="font-bold text-gray-800 dark:text-white text-lg">AMStem</span>
          </div>
          
          {/* Empty div for balancing flex space or user icon could go here */}
          <div className="w-8"></div>
        </div>
      )}

      <div className="flex h-screen overflow-hidden">
        {/* Sidebar with responsive props */}
        {!isAuthPage && (
          <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)} 
          />
        )}

        {/* Main Content Area */}
        <div 
          className={`flex-1 overflow-y-auto transition-all duration-300 h-full
            ${!isAuthPage ? 'md:ml-64' : ''} 
            ${!isAuthPage ? 'pt-16 md:pt-0' : ''} /* Add padding top on mobile for header */
          `}
        >
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
      </div>
      
      {/* Modal global untuk meminta login */}
      <LoginRequiredModal />
    </div>
  );
};

export default App;