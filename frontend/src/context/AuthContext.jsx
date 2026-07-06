import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore authentication state from localStorage
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        // Clear corrupt state
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { accessToken, id, name, email: userEmail, role } = response.data;

      const userObj = { id, name, email: userEmail, role };

      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(userObj));
      setUser(userObj);
      return userObj;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed. Please check your credentials.';
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, role = 'STUDENT') => {
    try {
      await api.post('/auth/register', { name, email, password, role });
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed. Try again.';
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
