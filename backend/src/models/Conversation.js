const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Conversation = sequelize.define('Conversation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  jobId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Jobs',
      key: 'id'
    },
    comment: 'Job this conversation is about'
  },
  clientId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  freelancerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  adminAccessEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'If true, messages are also encrypted with admin public key for dispute resolution'
  },
  disputeStatus: {
    type: DataTypes.ENUM('none', 'client_flagged', 'freelancer_flagged', 'both_flagged', 'resolved'),
    defaultValue: 'none',
    comment: 'Dispute status - admin can only decrypt if both_flagged'
  },
  disputeFlaggedByClient: {
    type: DataTypes.DATE,
    allowNull: true
  },
  disputeFlaggedByFreelancer: {
    type: DataTypes.DATE,
    allowNull: true
  },
  lastMessageAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  unreadCountClient: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  unreadCountFreelancer: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  archivedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['jobId', 'clientId', 'freelancerId']
    },
    {
      fields: ['clientId']
    },
    {
      fields: ['freelancerId']
    },
    {
      fields: ['disputeStatus']
    }
  ]
});

module.exports = Conversation;
