const sequelize = require('../config/database');
const User = require('./User');
const Job = require('./Job');
const Application = require('./Application');
const Payment = require('./Payment');
const Message = require('./Message');

// Define associations
const initializeModels = () => {
  // User -> Job (One-to-Many)
  User.hasMany(Job, { foreignKey: 'clientId', as: 'jobs' });
  Job.belongsTo(User, { foreignKey: 'clientId', as: 'client' });

  // User -> Application (One-to-Many)
  User.hasMany(Application, { foreignKey: 'freelancerId', as: 'applications' });
  Application.belongsTo(User, { foreignKey: 'freelancerId', as: 'freelancer' });

  // Job -> Application (One-to-Many)
  Job.hasMany(Application, { foreignKey: 'jobId', as: 'applications' });
  Application.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });

  // Application -> Payment (One-to-One)
  Application.hasOne(Payment, { foreignKey: 'applicationId', as: 'payment' });
  Payment.belongsTo(Application, { foreignKey: 'applicationId', as: 'application' });

  // Application -> Message (One-to-Many)
  Application.hasMany(Message, { foreignKey: 'applicationId', as: 'messages' });
  Message.belongsTo(Application, { foreignKey: 'applicationId', as: 'application' });

  // User -> Message (One-to-Many)
  User.hasMany(Message, { foreignKey: 'senderId', as: 'messages' });
  Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
};

// Attach models and sequelize to the initialize function for backward-compatible require('../models') usage
initializeModels.sequelize = sequelize;
initializeModels.User = User;
initializeModels.Job = Job;
initializeModels.Application = Application;
initializeModels.Payment = Payment;
initializeModels.Message = Message;

module.exports = initializeModels;
