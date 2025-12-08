const express = require('express');
const router = express.Router();
const { authMiddleware, isClient } = require('../middleware/auth');
const paymentService = require('../services/paymentService');

// Release Escrow Payment
router.post('/:id/release', authMiddleware, isClient, async (req, res) => {
  try {
    const { freelancerPaypalEmail } = req.body;
    
    if (!freelancerPaypalEmail) {
      return res.status(400).json({ error: 'Freelancer PayPal email required' });
    }
    
    const payment = await paymentService.releaseEscrowPayment(req.params.id, freelancerPaypalEmail);
    res.json(payment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Refund Payment
router.post('/:id/refund', authMiddleware, isClient, async (req, res) => {
  try {
    const payment = await paymentService.refundPayment(req.params.id);
    res.json(payment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
