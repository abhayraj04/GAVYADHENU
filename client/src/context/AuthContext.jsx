import React, { createContext, useContext, useEffect, useState } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getErrorMessage = (error, fallback) => {
    return error?.response?.data?.message || error?.message || fallback;
  };

  const loadProfile = async () => {
    const token = localStorage.getItem('gavyadhenu_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await API.get('/auth/profile');
      setUser(data);
    } catch (error) {
      const status = error.response?.status;
      if (status === 401 || status === 403) {
        localStorage.removeItem('gavyadhenu_token');
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProfile(); }, []);

  const login = async (email, password) => {
    try {
      const { data } = await API.post('/auth/login', { email, password });
      localStorage.setItem('gavyadhenu_token', data.token);
      setUser(data.user);
      return data.user;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Login failed. Please try again.'));
    }
  };

  const register = async (payload) => {
    try {
      const { data } = await API.post('/auth/register', payload);
      localStorage.setItem('gavyadhenu_token', data.token);
      setUser(data.user);
      return data.user;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Registration failed. Please try again.'));
    }
  };

  const logout = () => {
    localStorage.removeItem('gavyadhenu_token');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
