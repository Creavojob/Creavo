import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true); // Start mit loading=true

  // Beim Laden: Token aus localStorage lesen, User wird später bei Bedarf geladen
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      // User-Daten bei Bedarf nachladen (lazy loading)
      authAPI.getProfile()
        .then(response => setUser(response.data))
        .catch(() => {
          localStorage.removeItem('token');
          setToken(null);
        });
    }
    setLoading(false);
  }, []);

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await authAPI.register(userData);
      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);
      setUser(response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Registration failed';
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    setLoading(true);
    console.log('AuthContext: Starting login...', credentials.email);
    try {
      console.log('AuthContext: Calling API...');
      const response = await authAPI.login(credentials);
      console.log('AuthContext: API response received', response.data);
      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);
      setUser(response.data);
      console.log('AuthContext: Login successful');
      return response.data;
    } catch (error) {
      console.error('AuthContext: Login error', error);
      console.error('AuthContext: Error response:', error.response);
      const errorMsg = error.response?.data?.error || error.message || 'Login failed';
      throw errorMsg;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!token && !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
