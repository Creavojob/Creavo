const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Application = sequelize.define('Application', {
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
  bidAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  coverLetter: {
    type: DataTypes.TEXT
  },
  attachments: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'withdrawn', 'in_progress', 'submitted', 'in_review', 'approved', 'completed', 'disputed'),
    defaultValue: 'pending'
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'escrow', 'released', 'disputed'),
    defaultValue: 'pending'
  },
  freelancerSubmittedWork: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  clientReviewStatus: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'disputed'),
    defaultValue: 'pending'
  },
  clientFeedback: {
    type: DataTypes.TEXT
  },
  reviewDeadline: {
    type: DataTypes.DATE
  },
  clientSubmittedCompletion: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  freelancerSubmittedCompletion: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  ratedBySeller: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  ratedByBuyer: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
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

module.exports = Application;
