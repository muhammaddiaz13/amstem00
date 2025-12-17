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
    // Pastikan simpan ke localStorage DULUAN sebelum update state
    // Ini menjamin data persisten sudah ada sebelum komponen lain re-render
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    // 1. Kosongkan state user di memori
    setUser(null);
    
    // 2. NUCLEAR OPTION: Hapus SEMUA data di localStorage
    // Kita simpan dulu preference theme agar user tidak kaget theme berubah
    const savedTheme = localStorage.getItem('theme');
    
    // Hapus total
    localStorage.clear();
    
    // Kembalikan theme
    if (savedTheme) {
        localStorage.setItem('theme', savedTheme);
    }
    
    // Log untuk debugging
    console.log("Session cleared completely.");
  };

  // Fungsi baru untuk update data user tanpa logout
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