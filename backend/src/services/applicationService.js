const Application = require('../models/Application');
const Payment = require('../models/Payment');
const Job = require('../models/Job');
const User = require('../models/User');

const submitApplication = async (jobId, freelancerId, bidAmount, coverLetter) => {
  const job = await Job.findByPk(jobId);
  
  if (!job) {
    throw new Error('Job not found');
  }
  
  const existingApplication = await Application.findOne({
    where: { jobId, freelancerId }
  });
  
  if (existingApplication) {
    throw new Error('Already applied to this job');
  }
  
  const application = await Application.create({
    jobId,
    freelancerId,
    bidAmount,
    coverLetter
  });
  
  return application;
};

const acceptApplication = async (applicationId, clientId) => {
  const application = await Application.findByPk(applicationId);
  
  if (!application) {
    throw new Error('Application not found');
  }
  
  const job = await Job.findByPk(application.jobId);
  
  if (job.clientId !== clientId) {
    throw new Error('Unauthorized');
  }
  
  // Update application status
  await application.update({ status: 'accepted', paymentStatus: 'escrow' });
  
  // Create escrow payment (not released yet)
  const payment = await Payment.create({
    applicationId,
    amount: application.bidAmount,
    status: 'escrowed',
    type: 'escrow'
  });
  
  // Update job status
  await job.update({ status: 'in-progress' });
  
  return { application, payment };
};

const updateStatus = async (applicationId, status, userId, userType) => {
  const application = await Application.findByPk(applicationId);
  
  if (!application) {
    throw new Error('Application not found');
  }
  
  // Verify authorization
  if (userType === 'client') {
    const job = await Job.findByPk(application.jobId);
    if (job.clientId !== userId) throw new Error('Unauthorized');
  } else {
    if (application.freelancerId !== userId) throw new Error('Unauthorized');
  }
  
  await application.update({ status });
  return application;
};

const submitCompletion = async (applicationId, userType) => {
  const application = await Application.findByPk(applicationId);
  
  if (!application) {
    throw new Error('Application not found');
  }
  
  if (userType === 'client') {
    await application.update({ clientSubmittedCompletion: true });
  } else {
    await application.update({ freelancerSubmittedCompletion: true });
  }
  
  return application;
};

const completeApplication = async (applicationId) => {
  const application = await Application.findByPk(applicationId, {
    include: [Payment]
  });
  
  if (!application) {
    throw new Error('Application not found');
  }
  
  // Check if both have submitted completion
  if (!application.clientSubmittedCompletion || !application.freelancerSubmittedCompletion) {
    throw new Error('Both parties must submit completion');
  }
  
  // Update application status
  await application.update({ 
    status: 'completed',
    paymentStatus: 'released'
  });
  
  // Release payment (TODO: Integrate actual PayPal transfer)
  if (application.Payments && application.Payments.length > 0) {
    for (let payment of application.Payments) {
      await payment.update({ status: 'released' });
    }
  }
  
  return application;
};

const getApplications = async (userId, userType) => {
  let where = {};

  if (userType === 'freelancer') {
    where.freelancerId = userId;
  } else if (userType === 'client') {
    where = {
      '$job.clientId$': userId
    };
  }

  const applications = await Application.findAll({
    where,
    include: [
      { model: Job, as: 'job' },
      { model: User, as: 'freelancer', attributes: ['id', 'firstName', 'lastName', 'portfolio', 'resume'] }
    ],
    order: [['createdAt', 'DESC']]
  });

  return applications;
};

const getApplicationById = async (applicationId, userId, userType) => {
  const application = await Application.findByPk(applicationId, {
    include: [
      { model: Job, as: 'job' },
      { model: User, as: 'freelancer', attributes: ['id', 'firstName', 'lastName', 'portfolio', 'resume'] }
    ]
  });

  if (!application) throw new Error('Application not found');

  // Authorization: freelancers can only access their own; clients only if they own the job
  if (userType === 'freelancer' && application.freelancerId !== userId) {
    throw new Error('Unauthorized');
  }

  if (userType === 'client') {
    const job = await Job.findByPk(application.jobId);
    if (!job || job.clientId !== userId) throw new Error('Unauthorized');
  }

  return application;
};

module.exports = {
  submitApplication,
  acceptApplication,
  updateStatus,
  submitCompletion,
  completeApplication,
  getApplications
};
