const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const messageService = require('../services/messageService');

// Send Message
router.post('/:applicationId/messages', authMiddleware, async (req, res) => {
  try {
    const { content, messageType } = req.body;
    const message = await messageService.sendMessage(
      req.params.applicationId,
      req.userId,
      content,
      messageType || 'text'
    );
    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Messages
router.get('/:applicationId/messages', authMiddleware, async (req, res) => {
  try {
    const messages = await messageService.getMessages(req.params.applicationId);
    res.json(messages);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Submit Work for Review (Freelancer)
router.post('/:applicationId/submit-work', authMiddleware, async (req, res) => {
  try {
    const application = await messageService.submitWorkForReview(
      req.params.applicationId,
      req.userId
    );
    res.json(application);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Submit Client Review (Client)
router.post('/:applicationId/client-review', authMiddleware, async (req, res) => {
  try {
    const { reviewStatus, feedback } = req.body;
    const application = await messageService.submitClientReview(
      req.params.applicationId,
      req.userId,
      reviewStatus,
      feedback
    );
    res.json(application);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
