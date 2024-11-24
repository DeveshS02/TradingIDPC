// src/AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import { setAuthToken as setAPIAuthToken } from './api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const tokenFromStorage = localStorage.getItem('token');
  const [token, setToken] = useState(tokenFromStorage);
  const [user, setUser] = useState(tokenFromStorage ? jwt_decode(tokenFromStorage) : null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwt_decode(token);
        setUser(decoded);
        setAPIAuthToken(token); // Set token in API utility
      } catch (e) {
        console.error('Invalid token:', e);
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
      }
    } else {
      setUser(null);
    }
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
