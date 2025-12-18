import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    // Cek user login dari localStorage saat aplikasi dimuat
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser) {
           setUser(parsedUser);
        }
      } catch (e) {
        console.error("Failed to parse user data", e);
        localStorage.removeItem('user'); // Clean up bad data
      }
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    
    const savedTheme = localStorage.getItem('theme');
    
    localStorage.clear();
    
    if (savedTheme) {
        localStorage.setItem('theme', savedTheme);
    }
    
    console.log("Session cleared completely.");
  };

  const updateUser = (updatedData) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      const newUser = { ...prevUser, ...updatedData };
      localStorage.setItem('user', JSON.stringify(newUser));
      return newUser;
    });
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout,
      updateUser, 
      isLoginModalOpen, 
      openLoginModal, 
      closeLoginModal 
    }}>
      {children}
    </AuthContext.Provider>
  );
};