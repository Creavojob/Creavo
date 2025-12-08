const sequelize = require('../config/database');
const User = require('./User');
const Job = require('./Job');
const Application = require('./Application');
const Payment = require('./Payment');
const Message = require('./Message');
const Conversation = require('./Conversation');

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

  // Conversation Associations
  Job.hasMany(Conversation, { foreignKey: 'jobId', as: 'conversations' });
  Conversation.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });

  User.hasMany(Conversation, { foreignKey: 'clientId', as: 'conversationsAsClient' });
  User.hasMany(Conversation, { foreignKey: 'freelancerId', as: 'conversationsAsFreelancer' });
  Conversation.belongsTo(User, { foreignKey: 'clientId', as: 'client' });
  Conversation.belongsTo(User, { foreignKey: 'freelancerId', as: 'freelancer' });

  // Message Associations
  Conversation.hasMany(Message, { foreignKey: 'conversationId', as: 'messages' });
  Message.belongsTo(Conversation, { foreignKey: 'conversationId', as: 'conversation' });

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
initializeModels.Conversation = Conversation;

module.exports = initializeModels;
