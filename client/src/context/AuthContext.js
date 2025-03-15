import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      // Check if token exists in localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Set auth token header
        setAuthToken(token);
        
        // Verify token with backend
        const res = await axios.get('/api/auth/verify');
        
        if (res.data.valid) {
          setIsAuthenticated(true);
          setUser(res.data.user);
        } else {
          // Token is invalid
          localStorage.removeItem('token');
          setAuthToken(null);
        }
      } catch (err) {
        console.error('Auth verification error:', err);
        localStorage.removeItem('token');
        setAuthToken(null);
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Set auth token in axios headers
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
    }
  };

  // Login user
  const login = async (username, password) => {
    setError(null);
    
    try {
      const res = await axios.post('/api/auth/login', { username, password });
      
      // Save token to localStorage
      localStorage.setItem('token', res.data.token);
      
      // Set token in axios headers
      setAuthToken(res.data.token);
      
      // Verify token to get user data
      const verifyRes = await axios.get('/api/auth/verify');
      
      setIsAuthenticated(true);
      setUser(verifyRes.data.user);
      
      return true;
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Login failed'
      );
      return false;
    }
  };

  // Logout user
  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Remove token from axios headers
    setAuthToken(null);
    
    // Reset state
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        error,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 