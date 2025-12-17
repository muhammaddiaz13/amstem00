import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';
import Modal from './Modal.jsx';
import TaskForm from './TaskForm.jsx';
import { taskService } from '../services/taskService.js';
import { ConfirmToast } from './ConfirmToast.jsx';
import { toast } from 'react-hot-toast';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout, openLoginModal, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  // State untuk Task Modal
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  
  // State untuk Profile Modal
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  // State & Ref untuk Foto Profil
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  const navLinkClasses = ({ isActive }) =>
    `flex items-center p-3 rounded-lg transition-all duration-200 ${
      isActive
        ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm dark:bg-blue-900/30 dark:text-blue-400'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
    }`;

  // Reset form saat modal profile dibuka
  useEffect(() => {
    if (user && isProfileModalOpen) {
      setEditUsername(user.username || '');
      setAvatarPreview(user.avatar || null);
    }
  }, [user, isProfileModalOpen]);

  // Helper untuk mendapatkan inisial dengan aman
  const getUserInitial = () => {
    if (user && user.username && user.username.length > 0) {
      return user.username[0].toUpperCase();
    }
    return '?';
  };

  const getUsername = () => {
    return (user && user.username) ? user.username : 'Anonymous';
  };

  // Handler Ganti Foto (Preview Local)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validasi ukuran (misal max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size too large (max 2MB)");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNewAssignmentClick = () => {
    if (!user) {
      openLoginModal();
    } else {
      setIsTaskModalOpen(true);
      if(window.innerWidth < 768) onClose(); 
    }
  };

  const handleProfileClick = () => {
    if (!user) {
      openLoginModal();
    } else {
      setIsProfileModalOpen(true);
      if(window.innerWidth < 768) onClose();
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!editUsername.trim()) {
      toast.error("Username cannot be empty");
      return;
    }

    setIsEditingProfile(true);
    try {
      if (updateUser) {
        // Simpan username DAN avatar (base64 string) ke context/local storage
        updateUser({ 
          username: editUsername,
          avatar: avatarPreview 
        });
        toast.success("Profile updated successfully!");
        setIsProfileModalOpen(false);
      } else {
        console.error("updateUser function not found in AuthContext");
        toast.error("Update function missing. Refresh page.");
      }
    } catch (error) {
      console.error("Failed to update profile", error);
      toast.error("Failed to update profile");
    } finally {
      setIsEditingProfile(false);
    }
  };

  const handleTaskSubmit = async (task) => {
    try {
      await taskService.create({
        ...task,
        taskStatus: 'Unfinished',
        progress: 0
      });
      window.location.reload(); 
      setIsTaskModalOpen(false);
    } catch (error) {
      console.error("Failed to create task via sidebar", error);
      alert("Failed to create task. Please try again.");
    }
  };

  const handleAuthAction = () => {
    if (user) {
      ConfirmToast("Are you sure you want to logout from your account?", () => {
        logout();
        if(window.innerWidth < 768) onClose();
      });
    } else {
      navigate('/login');
      if(window.innerWidth < 768) onClose();
    }
  };

  const handleNavClick = () => {
      if(window.innerWidth < 768) onClose();
  };

  // --- COMPONENT AVATAR REUSABLE (Agar konsisten antara sidebar & modal) ---
  const UserAvatar = ({ size = "sm", src, alt, initial }) => {
    const sizeClasses = size === "lg" ? "w-28 h-28 text-5xl" : "w-10 h-10 text-lg";
    const dotClasses = size === "lg" 
      ? "w-6 h-6 border-4 right-1 bottom-1" 
      : "w-2.5 h-2.5 border-2 right-0 bottom-0";

    return (
      <div className={`relative ${sizeClasses} rounded-full flex-shrink-0`}>
        {src ? (
          <img 
            src={src} 
            alt={alt} 
            className="w-full h-full rounded-full object-cover border border-gray-200 dark:border-gray-600 shadow-sm"
          />
        ) : (
          <div className={`w-full h-full rounded-full flex items-center justify-center font-bold shadow-sm ${user ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
            {initial}
          </div>
        )}
        
        {/* GREEN ONLINE DOT */}
        {user && (
          <span className={`absolute ${dotClasses} bg-green-500 border-white dark:border-gray-800 rounded-full z-10`}></span>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-30 transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        onClick={onClose}
      ></div>

      {/* Sidebar Container */}
      <div 
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col z-30 transition-transform duration-300 ease-in-out transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        
        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-grow p-4 no-scrollbar">
          {/* User Profile Snippet - Now Clickable */}
          <div 
            onClick={handleProfileClick}
            className="flex items-center mb-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 group"
          >
            {/* Sidebar Avatar */}
            <div className="mr-3 transition-transform group-hover:scale-105">
              <UserAvatar 
                size="sm" 
                src={user?.avatar} 
                initial={getUserInitial()} 
              />
            </div>

            <div className="overflow-hidden flex-1">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-gray-800 dark:text-gray-200 truncate text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {getUsername()}
                </p>
                {user && <i className="fas fa-pen text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"></i>}
              </div>
              <div className="flex items-center mt-0.5">
                {/* Text Online Status */}
                <p className="text-xs text-gray-500 dark:text-gray-400">{user ? 'Online' : 'Guest Mode'}</p>
              </div>
            </div>
          </div>

          <nav className="space-y-1">
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-2">Main</p>
            <NavLink to="/dashboard" onClick={handleNavClick} className={navLinkClasses}>
              <span className="mr-3 text-lg">📊</span> Dashboard
            </NavLink>
            <NavLink to="/all-tasks" onClick={handleNavClick} className={navLinkClasses}>
              <span className="mr-3 text-lg">📝</span> All Tasks
            </NavLink>
            <NavLink to="/progress" onClick={handleNavClick} className={navLinkClasses}>
              <span className="mr-3 text-lg">📈</span> Progress
            </NavLink>
            <NavLink to="/calendar" onClick={handleNavClick} className={navLinkClasses}>
              <span className="mr-3 text-lg">📅</span> Calendar
            </NavLink>
            
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-6">Collaboration</p>
            <NavLink to="/team" onClick={handleNavClick} className={navLinkClasses}>
              <span className="mr-3 text-lg">👥</span> Team
            </NavLink>

            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-6">Categories</p>
            <NavLink to="/personal" onClick={handleNavClick} className={navLinkClasses}>
              <span className="mr-3 text-lg">👤</span> Personal
            </NavLink>
            <NavLink to="/work" onClick={handleNavClick} className={navLinkClasses}>
              <span className="mr-3 text-lg">💼</span> Work
            </NavLink>
            <NavLink to="/others" onClick={handleNavClick} className={navLinkClasses}>
              <span className="mr-3 text-lg">📦</span> Others
            </NavLink>
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex-shrink-0 space-y-3 bg-white dark:bg-gray-900 transition-colors duration-300">
           <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
           >
             <div className="flex items-center gap-2">
               <i className={`fas ${theme === 'light' ? 'fa-sun text-yellow-500' : 'fa-moon text-blue-400'}`}></i>
               <span className="text-sm font-medium">{theme === 'light' ? 'Light Mode' : 'Dark Mode'}</span>
             </div>
             <div className={`w-8 h-4 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform duration-200 ${theme === 'dark' ? 'left-4.5 translate-x-1' : 'left-0.5'}`}></div>
             </div>
           </button>

           <button
            className="new-assignments w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg transition-all duration-300 font-semibold flex items-center justify-center shadow-lg shadow-blue-200 hover:shadow-blue-300 dark:shadow-none transform hover:-translate-y-0.5"
            onClick={handleNewAssignmentClick}
          >
            <span className="mr-2 text-lg font-bold">+</span> New
          </button>

          <button
            className={`w-full py-2.5 rounded-lg transition-colors duration-300 font-semibold flex items-center justify-center border ${
              user 
              ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30 dark:hover:bg-red-900/40' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700'
            }`}
            onClick={handleAuthAction}
          >
            {user ? 'Logout' : 'Login'}
          </button>
        </div>
      </div>

      {/* Task Modal */}
      <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} title="New Task">
        <TaskForm onSubmit={handleTaskSubmit} />
      </Modal>

      {/* Profile Modal */}
      <Modal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} title="User Profile">
        <div className="flex flex-col items-center">
          
          {/* Avatar Besar di Modal (Clickable) */}
          <div className="mb-6 relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
             <UserAvatar 
                size="lg" 
                src={avatarPreview} 
                initial={getUserInitial()} 
             />
             
             {/* Overlay Hover Icon Kamera */}
             <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <i className="fas fa-camera text-white text-2xl"></i>
             </div>
             
             {/* Input File Hidden */}
             <input 
               type="file" 
               ref={fileInputRef} 
               onChange={handleImageChange} 
               accept="image/*"
               className="hidden" 
             />
          </div>
          
          <p className="text-sm text-gray-500 mb-6">Click avatar to change photo</p>

          <form onSubmit={handleUpdateProfile} className="w-full space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <input 
                type="email" 
                value={user?.email || ''} 
                disabled 
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Username
              </label>
              <input 
                type="text" 
                value={editUsername} 
                onChange={(e) => setEditUsername(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="pt-4 flex gap-3">
               <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
               >
                 Cancel
               </button>
               <button
                type="submit"
                disabled={isEditingProfile}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 dark:shadow-none disabled:opacity-70 flex items-center justify-center gap-2"
               >
                 {isEditingProfile ? 'Saving...' : 'Save Changes'}
               </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default Sidebar;