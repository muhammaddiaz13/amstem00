import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; 
import { createPortal } from 'react-dom'; // Import createPortal
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
  // State untuk sidebar. Default: Desktop (Buka), Mobile (Tutup)
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const location = useLocation();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  // Handle resize window agar responsif saat user resize browser di desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      {createPortal(
        <Toaster 
          position="top-center" 
          reverseOrder={false}
          containerStyle={{
            zIndex: 999999, // Layer paling atas
            top: 40, // Jarak dari atas layar
          }}
          toastOptions={{
            // Styling default untuk toast card
            className: 'shadow-xl border border-gray-100 dark:border-gray-700',
            style: {
              background: '#fff',
              color: '#333',
              zIndex: 999999,
            },
          }}
        />,
        document.body
      )}

      {/* GLOBAL HEADER / NAVBAR (Visible on ALL devices) */}
      {!isAuthPage && (
        <div className="fixed top-0 left-0 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-40 px-4 h-16 flex items-center justify-between shadow-sm transition-colors duration-300">
          <div className="flex items-center gap-3">
            {/* Toggle Button */}
            <button 
              onClick={toggleSidebar}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors focus:outline-none"
            >
              <i className={`fas ${isSidebarOpen ? 'fa-indent' : 'fa-bars'} text-xl`}></i>
            </button>
            
            {/* Brand Logo */}
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md shadow-blue-200 dark:shadow-none">A</div>
               <span className="font-bold text-gray-800 dark:text-white text-lg tracking-tight">AMStem</span>
            </div>
          </div>
          
          {/* Right Side Header Elements (Optional: User Icon, Notif, etc) */}
          <div className="w-8"></div>
        </div>
      )}

      {/* 
         Main layout container
         Logic: Removed pt-16 when on Auth Pages to prevent content from being pushed down.
      */}
      <div className={`flex h-screen overflow-hidden ${!isAuthPage ? 'pt-16' : ''}`}>
        {/* Sidebar */}
        {!isAuthPage && (
          <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)} 
          />
        )}

        {/* Main Content Area */}
        <div 
          className={`flex-1 overflow-y-auto transition-all duration-300 h-full p-0
            ${!isAuthPage && isSidebarOpen ? 'md:ml-64' : 'md:ml-0'} 
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