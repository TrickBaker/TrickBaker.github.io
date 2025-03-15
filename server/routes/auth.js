const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Load user credentials from config
const getUserCredentials = () => {
  try {
    // In a real app, this would be stored in a database
    // For simplicity, we're using environment variables or a default for demo
    return {
      username: process.env.ADMIN_USERNAME || 'admin',
      // In production, this would be a hashed password stored securely
      password: process.env.ADMIN_PASSWORD_HASH || 
        '$2a$10$mLmY7U6/v7zOIRHrJLFFyOJfm1ZiJUUsw5g3bw5orIGhGRT9Dn/Iy' // hashed 'password123'
    };
  } catch (error) {
    console.error('Error loading user credentials:', error);
    return null;
  }
};

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const userCredentials = getUserCredentials();
    
    if (!userCredentials) {
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // Check if username matches
    if (username !== userCredentials.username) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, userCredentials.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create and sign JWT token
    const payload = {
      user: {
        username: userCredentials.username
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'defaultsecret', // Use environment variable in production
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/auth/verify
// @desc    Verify token is valid
// @access  Private
router.get('/verify', (req, res) => {
  try {
    const token = req.header('x-auth-token');

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret');
    
    res.json({ valid: true, user: decoded.user });
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
});

module.exports = router; 