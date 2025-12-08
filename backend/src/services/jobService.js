const Job = require('../models/Job');
const Application = require('../models/Application');
const { Op } = require('sequelize');

const createJob = async (clientId, jobData) => {
  const job = await Job.create({
    clientId,
    ...jobData
  });
  return job;
};

const getJobs = async (filters = {}, userId = null) => {
  const where = {};
  
  // Basis-Filter
  if (filters.category) where.category = filters.category;
  if (filters.minBudget) where.budget = { [Op.gte]: filters.minBudget };
  if (filters.status) where.status = filters.status;
  
  // Wenn kein spezifischer Status-Filter: Zeige nur offene Jobs für öffentliche Ansicht
  // Aber für eingeloggte User zeige mehr
  if (!filters.status) {
    if (!userId) {
      where.status = 'open'; // Nicht eingeloggt: nur offene Jobs
    }
    // Eingeloggt ohne Filter: zeige alle außer archivierte
    // (später können wir hier erweiterte Logik hinzufügen)
  }
  
  const jobs = await Job.findAll({
    where,
    limit: filters.limit || 20,
    offset: filters.offset || 0,
    order: [['createdAt', 'DESC']]
  });
  
  return jobs;
};

const getJobById = async (jobId, userId = null) => {
  const job = await Job.findByPk(jobId);
  
  if (!job) {
    throw new Error('Job not found');
  }
  
  // Sichtbarkeitslogik
  if (job.status === 'open') {
    // Offen für alle
  } else if (job.status === 'in-progress') {
    // Nur für Bewerber
    if (!userId) {
      throw new Error('Unauthorized');
    }
    const hasApplied = await Application.findOne({
      where: { jobId, freelancerId: userId }
    });
    if (!hasApplied && job.clientId !== userId) {
      throw new Error('Unauthorized');
    }
  } else if (job.status === 'abgeschlossen') {
    // Nur für gewählten Freelancer oder Client
    if (!userId || (job.assignedFreelancerId !== userId && job.clientId !== userId)) {
      throw new Error('Unauthorized');
    }
  } else if (job.status === 'closed') {
    // Nur für Client
    if (!userId || job.clientId !== userId) {
      throw new Error('Unauthorized');
    }
  }
  
  // Increment view count
  await job.update({ views: job.views + 1 });
  
  return job;
};

const updateJob = async (jobId, clientId, updateData) => {
  const job = await Job.findByPk(jobId);
  
  if (!job) {
    throw new Error('Job not found');
  }
  
  if (job.clientId !== clientId) {
    throw new Error('Unauthorized');
  }
  
  // Archivierungslogik bei Status-Änderung
  if (updateData.status) {
    const now = new Date();
    
    if (updateData.status === 'closed') {
      // Geschlossen: 1 Woche bis Löschung
      updateData.archivedAt = now;
      updateData.scheduledDeletion = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    } else if (updateData.status === 'abgeschlossen') {
      // Abgeschlossen: 1 Jahr bis Löschung
      updateData.archivedAt = now;
      updateData.scheduledDeletion = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
    }
  }
  
  await job.update(updateData);
  return job;
};

const deleteJob = async (jobId, clientId) => {
  const job = await Job.findByPk(jobId);
  
  if (!job) {
    throw new Error('Job not found');
  }
  
  if (job.clientId !== clientId) {
    throw new Error('Unauthorized');
  }
  
  await job.destroy();
  return { message: 'Job deleted' };
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob
};
