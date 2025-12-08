const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  conversationId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Conversations',
      key: 'id'
    },
    comment: 'Conversation this message belongs to'
  },
  senderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  // E2EE Fields
  encryptedContent: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Message encrypted with recipient public key'
  },
  encryptedForAdmin: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Message encrypted with admin public key (only if adminAccessEnabled)'
  },
  nonce: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Nonce for encryption'
  },
  senderPublicKey: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Sender public key at time of sending (for verification)'
  },
  messageType: {
    type: DataTypes.ENUM('text', 'system', 'dispute_flag'),
    defaultValue: 'text'
  },
  readAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true,
  updatedAt: false,
  paranoid: true,
  indexes: [
    {
      fields: ['conversationId', 'createdAt']
    },
    {
      fields: ['senderId']
    }
  ]
});

module.exports = Message;
