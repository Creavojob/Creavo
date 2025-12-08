const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  clientId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  skills: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  budget: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'USD'
  },
  duration: {
    type: DataTypes.STRING
  },
  experience: {
    type: DataTypes.ENUM('entry', 'intermediate', 'expert'),
    defaultValue: 'intermediate'
  },
  status: {
    type: DataTypes.ENUM('open', 'in-progress', 'abgeschlossen', 'closed'),
    defaultValue: 'open'
  },
  visibility: {
    type: DataTypes.ENUM('public', 'private'),
    defaultValue: 'public'
  },
  assignedFreelancerId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  archivedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  scheduledDeletion: {
    type: DataTypes.DATE,
    allowNull: true
  },
  attachment: {
    type: DataTypes.STRING
  },
  deadline: {
    type: DataTypes.DATE
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
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

module.exports = Job;
