const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../services/authService');
const { authMiddleware } = require('../middleware/auth');

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, userType, companyName, portfolio, resume } = req.body;
    
    if (!email || !password || !firstName || !lastName || !userType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    let additionalData = {};
    if (userType === 'client') {
      additionalData = { companyName };
    } else if (userType === 'freelancer') {
      additionalData = { portfolio, resume };
    }

    const result = await registerUser(email, password, firstName, lastName, userType, additionalData);
    
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    const result = await loginUser(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Get Profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await getUserProfile(req.userId);
    const userData = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      userType: user.userType,
      isAdmin: user.isAdmin || false,
      companyName: user.companyName,
      portfolio: user.portfolio,
      resume: user.resume,
      createdAt: user.createdAt
    };
    res.json(userData);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;
