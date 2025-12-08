const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userType = decoded.userType;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const isFreelancer = (req, res, next) => {
  if (req.userType !== 'freelancer') {
    return res.status(403).json({ error: 'Only freelancers can access this' });
  }
  next();
};

const isClient = (req, res, next) => {
  if (req.userType !== 'client') {
    return res.status(403).json({ error: 'Only clients can access this' });
  }
  next();
};

module.exports = { authMiddleware, isFreelancer, isClient };
