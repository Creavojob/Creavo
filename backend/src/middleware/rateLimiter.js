/**
 * Rate Limiting Middleware for Chat Routes
 */
const rateLimit = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis');

/**
 * Message sending rate limiter
 * Prevents spam and DOS attacks
 */
const messageLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 messages per minute per user
  message: 'Too many messages sent, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) => {
    // Nutze die empfohlene ipKeyGenerator Hilfsfunktion für IPv6
    const { ipKeyGenerator } = require('express-rate-limit');
    return req.userId || ipKeyGenerator(req, res);
  },
  handler: (req, res) => {
    res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'You are sending messages too quickly. Please wait a moment.',
      retryAfter: 60
    });
  }
});

/**
 * Key setup rate limiter
 * Prevents brute force key generation attacks
 */
const keySetupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 key setups per 15 minutes
  message: 'Too many key setup attempts',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) => {
    const { ipKeyGenerator } = require('express-rate-limit');
    return req.userId || ipKeyGenerator(req, res);
  },
  handler: (req, res) => {
    res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'Too many key setup attempts. Please try again later.',
      retryAfter: 900
    });
  }
});

/**
 * Conversation creation rate limiter
 */
const conversationLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // 10 conversations per 5 minutes
  message: 'Too many conversations created',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) => {
    const { ipKeyGenerator } = require('express-rate-limit');
    return req.userId || ipKeyGenerator(req, res);
  }
});

/**
 * General API rate limiter for chat endpoints
 */
const generalChatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: 'Too many requests',
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  messageLimiter,
  keySetupLimiter,
  conversationLimiter,
  generalChatLimiter
};
