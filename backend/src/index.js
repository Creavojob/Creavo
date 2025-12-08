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
const chatRoutes = require('./routes/chat');
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
app.use('/api/chat', chatRoutes);
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
    
    // Starte HTTP-Server und Socket.io mit robustem Error-Handling
    const server = require('http').createServer(app);
    const { Server } = require('socket.io');
    const io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true
      }
    });

    // Basis E2EE WebSocket-Logik
    io.on('connection', (socket) => {
      console.log('🔌 User connected:', socket.id);

      socket.on('encrypted_message', (data) => {
        socket.to(data.conversationId).emit('new_encrypted_message', data);
      });

      socket.on('join_conversation', (conversationId) => {
        socket.join(conversationId);
      });

      socket.on('disconnect', () => {
        console.log('🔌 User disconnected:', socket.id);
      });
    });

    // Graceful shutdown helper
    const gracefulShutdown = async (signal) => {
      console.log(`⚠️  Received ${signal}. Closing server...`);
      try {
        io.close();
        server.close(() => {
          console.log('✅ Server closed');
          sequelize.close().then(() => {
            console.log('✅ Database connection closed');
            process.exit(0);
          });
        });
      } catch (err) {
        console.error('Error during shutdown', err);
        process.exit(1);
      }
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('uncaughtException', (err) => {
      console.error('❌ Uncaught Exception:', err);
      try {
        gracefulShutdown('uncaughtException');
      } catch (e) {
        console.error('Error during uncaughtException shutdown', e);
        process.exit(1);
      }
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
      try {
        gracefulShutdown('unhandledRejection');
      } catch (e) {
        console.error('Error during unhandledRejection shutdown', e);
        process.exit(1);
      }
    });

    // Try listening, with automatic fallback to next free port if EADDRINUSE
    const tryListen = (startPort, attempts = 5) => {
      let port = startPort;
      const attempt = () => {
        server.listen(port, () => {
          console.log(`🚀 Creavo Backend + WebSocket running on port ${port}`);
          console.log(`Environment: ${process.env.NODE_ENV}`);
        });
      };

      server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.warn(`⚠️  Port ${port} in use. Trying port ${port + 1}...`);
          port += 1;
          if (port <= startPort + attempts) {
            setTimeout(() => attempt(), 250);
          } else {
            console.error('❌ No free ports available in range. Exiting.');
            process.exit(1);
          }
        } else {
          console.error('Server error:', err);
          process.exit(1);
        }
      });

      attempt();
    };

    tryListen(Number(PORT) || 5000, 5);
  })
  .catch(err => {
    console.error('❌ Database sync failed:', err);
    process.exit(1);
  });

module.exports = app;
