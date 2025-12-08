const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Import database and models
const sequelize = require('./config/database');
const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');
const Payment = require('./models/Payment');
const initializeModels = require('./models/index');

// Import utils
const { startJobCleanup } = require('./utils/jobCleanup');

// Import routes
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const applicationRoutes = require('./routes/applications');
const paymentRoutes = require('./routes/payments');
const messageRoutes = require('./routes/messages');
const uploadRoutes = require('./routes/uploads');
const adminRoutes = require('./routes/admin');
const path = require('path');

const app = express();

// Initialize model associations
initializeModels();
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/messages', messageRoutes);
// Uploads
app.use('/api/uploads', uploadRoutes);
// Admin
app.use('/api/admin', adminRoutes);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    status: err.status || 500
  });
});

// Start server
const PORT = process.env.PORT || 5000;

// Sync database and start server
sequelize.sync({ force: false })
  .then(() => {
    console.log('✅ Database synchronized');
    
    // Starte automatische Job-Cleanup
    startJobCleanup();
    
    app.listen(PORT, () => {
      console.log(`🚀 Creavo Backend running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });
  })
  .catch(err => {
    console.error('❌ Database sync failed:', err);
    process.exit(1);
  });

module.exports = app;
