import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

// Demo mode constants for GitHub Pages deployment
const DEMO_MODE = window.location.hostname === 'trickbaker.github.io';
const DEMO_USER = { username: 'admin' };
const DEMO_TOKEN = 'demo-token';
// Real credentials from server/.env
const DEMO_CREDENTIALS = { 
  username: 'admin',  // From ADMIN_USERNAME in .env
  password: 'password123' // From the comment in .env that says this is the unhashed version
};

// Actual contact data from server/data/contacts.json
const DEMO_CONTACT_DATA = {
  "name": "Anton",
  "title": "Solution Architecture",
  "company": "De heus",
  "email": "haminton46@gmail.com",
  "phone": "+84 782884650",
  "address": "188/1 Nguyễn Văn Hưởng, Phường Thảo Điền, Quận 2",
  "website": "https://trickbaker.github.io",
  "bio": "Experienced product manager with a passion for creating user-friendly digital experiences.",
  "socials": {
    "linkedin": "https://linkedin.com/in/johndoe",
    "twitter": "https://twitter.com/johndoe",
    "github": "https://github.com/johndoe",
    "instagram": "https://instagram.com/johndoe"
  },
  "profileImage": "https://rawzonestorage.blob.core.windows.net/d-public/users/avatars/07832af9743bb893c93ec37d5174ebc6ea2e1975_1741337099976.jpg",
  "bankAccounts": [
    {
      "bankName": "Techcombank",
      "accountNumber": "19033953608016",
      "accountType": "Checking",
      "routingNumber": "TECHCOMBANK",
      "swift": "VTCBVNVX"
    }
  ],
  "taxNumber": "123-45-6789",
  "identificationNumber": "AB-123456789"
};

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
        if (DEMO_MODE) {
          // Demo mode - just set as authenticated if token matches demo token
          if (token === DEMO_TOKEN) {
            setIsAuthenticated(true);
            setUser(DEMO_USER);
          } else {
            localStorage.removeItem('token');
          }
          setLoading(false);
        } else {
          // Production mode - verify with server
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
          setLoading(false);
        }
      } catch (err) {
        console.error('Auth verification error:', err);
        localStorage.removeItem('token');
        setAuthToken(null);
        setLoading(false);
      }
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
      if (DEMO_MODE) {
        // Demo mode login - check against demo credentials
        if (username === DEMO_CREDENTIALS.username && password === DEMO_CREDENTIALS.password) {
          localStorage.setItem('token', DEMO_TOKEN);
          setIsAuthenticated(true);
          setUser(DEMO_USER);
          return true;
        } else {
          setError('Invalid credentials');
          return false;
        }
      } else {
        // Production mode - verify with server
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
      }
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

  // Get contact data
  const getContactData = async () => {
    if (DEMO_MODE) {
      // In demo mode, return the demo data
      return DEMO_CONTACT_DATA;
    } else {
      // In production, get data from the server
      try {
        const res = await axios.get('/api/contact');
        return res.data;
      } catch (err) {
        console.error('Error fetching contact data:', err);
        return null;
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        error,
        login,
        logout,
        getContactData,
        demoMode: DEMO_MODE
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 