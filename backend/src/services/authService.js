const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, userType: user.userType },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

const registerUser = async (email, password, firstName, lastName, userType, additionalData = {}) => {
  const existingUser = await User.findOne({ where: { email } });

  if (existingUser) {
    throw new Error('Email already registered');
  }

  const user = await User.create({
    email,
    password,
    firstName,
    lastName,
    userType,
    ...additionalData
  });

  return {
    id: user.id,
    email: user.email,
    userType: user.userType,
    token: generateToken(user)
  };
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ where: { email } });

  if (!user || !await user.comparePassword(password)) {
    throw new Error('Invalid credentials');
  }

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    userType: user.userType,
    isAdmin: user.isAdmin || false,
    token: generateToken(user)
  };
};

const getUserProfile = async (userId) => {
  const user = await User.findByPk(userId);
  
  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

module.exports = {
  generateToken,
  registerUser,
  loginUser,
  getUserProfile
};
