import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('roteiros_user');
      return saved ? JSON.parse(saved) : null;
    } catch (err) {
      console.error('Failed to parse user from localStorage:', err);
      localStorage.removeItem('roteiros_user');
      return null;
    }
  });

  const login = (userData) => {
    const userObj = { ...userData, name: userData.name || 'Demo User' };
    setUser(userObj);
    try {
      localStorage.setItem('roteiros_user', JSON.stringify(userObj));
    } catch (err) {
      console.error('Failed to save user to localStorage:', err);
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('roteiros_user');
    } catch (err) {
      console.error('Failed to remove user from localStorage:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
