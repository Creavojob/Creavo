const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');
const { 
  messageLimiter, 
  keySetupLimiter, 
  conversationLimiter,
  generalChatLimiter 
} = require('../middleware/rateLimiter');
const {
  validateMessageInput,
  validatePublicKeyInput,
  validateConversationId,
  validateUserId
} = require('../middleware/validation');
const {
  logAdminMessageAccess,
  logDisputeFlag,
  logKeySetup
} = require('../middleware/auditLog');
const chatService = require('../services/chatService');
const { User } = require('../models');

// Apply general rate limiter to all chat routes
router.use(generalChatLimiter);

// GET /api/chat/conversations - Get all conversations for current user
router.get('/conversations', authMiddleware, async (req, res) => {
  try {
    const conversations = await chatService.getUserConversations(req.userId);
    res.json(conversations);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/chat/conversations - Create or get conversation
router.post('/conversations', authMiddleware, conversationLimiter, async (req, res) => {
  try {
    const { jobId, clientId, freelancerId, adminAccessEnabled } = req.body;

    // Verify user is either client or freelancer
    if (req.userId !== clientId && req.userId !== freelancerId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const conversation = await chatService.getOrCreateConversation(
      jobId,
      clientId,
      freelancerId,
      adminAccessEnabled || false
    );

    res.json(conversation);
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/chat/conversations/:id/messages - Get messages for a conversation
router.get('/conversations/:id/messages', authMiddleware, validateConversationId, async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const messages = await chatService.getConversationMessages(
      id,
      req.userId,
      parseInt(limit),
      parseInt(offset)
    );

    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/chat/conversations/:id/messages - Send a message
router.post('/conversations/:id/messages', authMiddleware, validateConversationId, messageLimiter, validateMessageInput, async (req, res) => {
  try {
    const { id } = req.params;
    const { encryptedContent, encryptedForAdmin, nonce, senderPublicKey } = req.body;

    // Validation is already done by middleware
    const message = await chatService.sendMessage(
      id,
      req.userId,
      encryptedContent,
      encryptedForAdmin || null,
      nonce,
      senderPublicKey
    );

    res.json(message);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/chat/conversations/:id/flag-dispute - Flag conversation for dispute
router.post('/conversations/:id/flag-dispute', authMiddleware, validateConversationId, logDisputeFlag, async (req, res) => {
  try {
    const { id } = req.params;
    const conversation = await chatService.flagForDispute(id, req.userId);
    res.json(conversation);
  } catch (error) {
    console.error('Flag dispute error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/chat/keys/:userId - Get public key for a user
router.get('/keys/:userId', authMiddleware, validateUserId, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId, {
      attributes: ['id', 'publicKey', 'firstName', 'lastName']
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.publicKey) {
      return res.status(404).json({ error: 'User has not set up encryption yet' });
    }

    res.json({
      userId: user.id,
      publicKey: user.publicKey,
      firstName: user.firstName,
      lastName: user.lastName
    });
  } catch (error) {
    console.error('Get public key error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/chat/keys - Set/Update user's public key
router.post('/keys', authMiddleware, keySetupLimiter, validatePublicKeyInput, logKeySetup, async (req, res) => {
  try {
    const { publicKey, encryptedPrivateKey } = req.body;

    // Validation is already done by middleware
    const user = await User.findByPk(req.userId);
    await user.update({
      publicKey,
      encryptedPrivateKey: encryptedPrivateKey || null
    });

    res.json({
      message: 'Keys updated successfully',
      publicKey: user.publicKey
    });
  } catch (error) {
    console.error('Set public key error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Admin Routes

// GET /api/chat/admin/overview - Get overview of all conversations (Admin only)
router.get('/admin/overview', isAdmin, async (req, res) => {
  try {
    const overview = await chatService.getAdminConversationOverview();
    res.json(overview);
  } catch (error) {
    console.error('Get admin overview error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/chat/admin/disputes - Get all disputes (Admin only)
router.get('/admin/disputes', isAdmin, async (req, res) => {
  try {
    const disputes = await chatService.getAllDisputes();
    res.json(disputes);
  } catch (error) {
    console.error('Get disputes error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/chat/admin/conversations/:id/messages - Get encrypted messages for dispute resolution (Admin only)
router.get('/admin/conversations/:id/messages', isAdmin, validateConversationId, logAdminMessageAccess, async (req, res) => {
  try {
    const { id } = req.params;
    const conversation = await chatService.getConversationMessages(id, req.userId, 1000, 0);
    
    // Admin can only see if both parties flagged dispute
    const conv = await require('../models').Conversation.findByPk(id);
    if (conv.disputeStatus !== 'both_flagged') {
      return res.status(403).json({ 
        error: 'Access denied. Both parties must flag the conversation for dispute before admin can access messages.'
      });
    }

    res.json(conversation);
  } catch (error) {
    console.error('Get admin messages error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
