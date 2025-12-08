const Payment = require('../models/Payment');
const paypal = require('../config/paypal');

const createEscrowPayment = async (applicationId, amount, currency = 'USD') => {
  const payment = await Payment.create({
    applicationId,
    amount,
    currency,
    type: 'escrow',
    status: 'pending'
  });
  
  return payment;
};

const releaseEscrowPayment = async (paymentId, freelancerPaypalEmail) => {
  const payment = await Payment.findByPk(paymentId);
  
  if (!payment) {
    throw new Error('Payment not found');
  }
  
  if (payment.status !== 'captured') {
    throw new Error('Payment must be captured before release');
  }
  
  // Create payout to freelancer
  const payout = {
    sender_batch_header: {
      sender_batch_id: `${paymentId}-${Date.now()}`,
      email_subject: 'You have a Creavo payment'
    },
    items: [{
      recipient_type: 'EMAIL',
      amount: {
        value: payment.amount.toString(),
        currency: payment.currency
      },
      receiver: freelancerPaypalEmail
    }]
  };
  
  // In production, integrate actual PayPal payout
  
  await payment.update({
    status: 'released',
    releaseDate: new Date()
  });
  
  return payment;
};

const refundPayment = async (paymentId) => {
  const payment = await Payment.findByPk(paymentId);
  
  if (!payment) {
    throw new Error('Payment not found');
  }
  
  // In production, integrate actual PayPal refund
  
  await payment.update({ status: 'refunded' });
  
  return payment;
};

module.exports = {
  createEscrowPayment,
  releaseEscrowPayment,
  refundPayment
};
