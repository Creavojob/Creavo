const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Admin middleware - NUR für Super-Admin (isAdmin=true in DB)
const isAdmin = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Kein Token vorhanden' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
    
    // User aus DB laden um isAdmin zu prüfen
    const user = await User.findByPk(decoded.id);
    
    if (!user || !user.isAdmin) {
      return res.status(404).json({ error: 'Seite nicht gefunden' }); // 404 statt 403 - für andere sieht es so aus als gäbe es die Seite nicht
    }

    req.user = decoded;
    req.adminUser = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Ungültiger Token' });
  }
};

module.exports = { isAdmin };
