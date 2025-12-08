/**
 * Audit Logging Middleware
 * Logs sensitive actions for security audit trails
 */

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * AuditLog Model
 */
const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    comment: 'User who performed the action'
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Action performed (e.g., ADMIN_VIEW_MESSAGES, FLAG_DISPUTE)'
  },
  resource: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Resource affected (e.g., conversation:uuid)'
  },
  details: {
    type: DataTypes.JSONB,
    comment: 'Additional details about the action'
  },
  ipAddress: {
    type: DataTypes.STRING,
    comment: 'IP address of the request'
  },
  userAgent: {
    type: DataTypes.TEXT,
    comment: 'User agent string'
  },
  success: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Whether the action was successful'
  },
  errorMessage: {
    type: DataTypes.TEXT,
    comment: 'Error message if action failed'
  }
}, {
  timestamps: true,
  tableName: 'audit_logs',
  indexes: [
    { fields: ['userId'] },
    { fields: ['action'] },
    { fields: ['createdAt'] },
    { fields: ['resource'] }
  ]
});

/**
 * Log an audit event
 */
const logAudit = async (options) => {
  const {
    userId,
    action,
    resource,
    details = {},
    ipAddress = null,
    userAgent = null,
    success = true,
    errorMessage = null
  } = options;

  try {
    await AuditLog.create({
      userId,
      action,
      resource,
      details,
      ipAddress,
      userAgent,
      success,
      errorMessage
    });
  } catch (error) {
    // Don't fail the request if audit logging fails
    console.error('Audit logging error:', error);
  }
};

/**
 * Middleware to log admin message access
 */
const logAdminMessageAccess = async (req, res, next) => {
  const originalJson = res.json;
  
  res.json = function(data) {
    // Log after successful response
    logAudit({
      userId: req.userId,
      action: 'ADMIN_VIEW_DISPUTE_MESSAGES',
      resource: `conversation:${req.params.id}`,
      details: {
        messageCount: data?.length || 0,
        timestamp: new Date().toISOString()
      },
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent'),
      success: true
    });
    
    return originalJson.call(this, data);
  };
  
  next();
};

/**
 * Middleware to log dispute flagging
 */
const logDisputeFlag = async (req, res, next) => {
  const originalJson = res.json;
  
  res.json = function(data) {
    logAudit({
      userId: req.userId,
      action: 'FLAG_DISPUTE',
      resource: `conversation:${req.params.id}`,
      details: {
        disputeStatus: data?.disputeStatus,
        timestamp: new Date().toISOString()
      },
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent'),
      success: true
    });
    
    return originalJson.call(this, data);
  };
  
  next();
};

/**
 * Middleware to log key setup/updates
 */
const logKeySetup = async (req, res, next) => {
  const originalJson = res.json;
  
  res.json = function(data) {
    logAudit({
      userId: req.userId,
      action: 'UPDATE_ENCRYPTION_KEYS',
      resource: `user:${req.userId}`,
      details: {
        hasPublicKey: !!req.body.publicKey,
        hasEncryptedPrivateKey: !!req.body.encryptedPrivateKey,
        timestamp: new Date().toISOString()
      },
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent'),
      success: true
    });
    
    return originalJson.call(this, data);
  };
  
  next();
};

/**
 * Get audit logs (Admin only)
 */
const getAuditLogs = async (options = {}) => {
  const {
    userId = null,
    action = null,
    startDate = null,
    endDate = null,
    limit = 100,
    offset = 0
  } = options;

  const where = {};
  
  if (userId) where.userId = userId;
  if (action) where.action = action;
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt[Sequelize.Op.gte] = startDate;
    if (endDate) where.createdAt[Sequelize.Op.lte] = endDate;
  }

  return await AuditLog.findAll({
    where,
    order: [['createdAt', 'DESC']],
    limit,
    offset
  });
};

module.exports = {
  AuditLog,
  logAudit,
  logAdminMessageAccess,
  logDisputeFlag,
  logKeySetup,
  getAuditLogs
};
