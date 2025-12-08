const Message = require('../models/Message');
const Application = require('../models/Application');
const User = require('../models/User');

const sendMessage = async (applicationId, senderId, content, messageType = 'text') => {
  const application = await Application.findByPk(applicationId);
  
  if (!application) {
    throw new Error('Application not found');
  }
  
  const message = await Message.create({
    applicationId,
    senderId,
    content,
    messageType
  });
  
  return message;
};

const getMessages = async (applicationId) => {
  const messages = await Message.findAll({
    where: { applicationId },
    include: [
      {
        model: User,
        as: 'sender',
        attributes: ['id', 'firstName', 'email']
      }
    ],
    order: [['createdAt', 'ASC']]
  });
  
  return messages;
};

const submitWorkForReview = async (applicationId, freelancerId) => {
  const application = await Application.findByPk(applicationId);
  
  if (!application) {
    throw new Error('Application not found');
  }
  
  if (application.freelancerId !== freelancerId) {
    throw new Error('Unauthorized');
  }
  
  // Update status to submitted
  await application.update({ 
    status: 'submitted',
    freelancerSubmittedWork: true,
    clientReviewStatus: 'pending',
    reviewDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days
  });
  
  // Send system message
  await Message.create({
    applicationId,
    senderId: freelancerId,
    content: 'Freelancer hat die Arbeit zur Überprüfung eingereicht',
    messageType: 'system'
  });
  
  return application;
};

const submitClientReview = async (applicationId, clientId, reviewStatus, feedback = null) => {
  const application = await Application.findByPk(applicationId, {
    include: { model: 'Job', as: 'job' }
  });
  
  if (!application) {
    throw new Error('Application not found');
  }
  
  // Verify client ownership
  const job = await require('../models/Job').findByPk(application.jobId);
  if (job.clientId !== clientId) {
    throw new Error('Unauthorized');
  }
  
  if (reviewStatus === 'approved') {
    await application.update({
      status: 'approved',
      clientReviewStatus: 'approved',
      paymentStatus: 'released'
    });
    
    await Message.create({
      applicationId,
      senderId: clientId,
      content: 'Client hat die Arbeit akzeptiert ✅',
      messageType: 'system'
    });
  } else if (reviewStatus === 'rejected') {
    await application.update({
      status: 'in_progress',
      clientReviewStatus: 'rejected',
      clientFeedback: feedback
    });
    
    await Message.create({
      applicationId,
      senderId: clientId,
      content: `Client hat Änderungen angefordert: ${feedback}`,
      messageType: 'feedback'
    });
  } else if (reviewStatus === 'disputed') {
    await application.update({
      status: 'disputed',
      clientReviewStatus: 'disputed',
      paymentStatus: 'disputed'
    });
    
    await Message.create({
      applicationId,
      senderId: clientId,
      content: 'Client hat ein Dispute eingeleitet - Admin Review erforderlich',
      messageType: 'system'
    });
  }
  
  return application;
};

module.exports = {
  sendMessage,
  getMessages,
  submitWorkForReview,
  submitClientReview
};
