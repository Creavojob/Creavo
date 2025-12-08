const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  applicationId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Applications',
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'USD'
  },
  paypalTransactionId: {
    type: DataTypes.STRING
  },
  status: {
    type: DataTypes.ENUM('pending', 'authorized', 'captured', 'released', 'refunded', 'failed'),
    defaultValue: 'pending'
  },
  type: {
    type: DataTypes.ENUM('escrow', 'freelancer-payment'),
    defaultValue: 'escrow'
  },
  releaseDate: {
    type: DataTypes.DATE
  },
  description: {
    type: DataTypes.TEXT
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = Payment;
