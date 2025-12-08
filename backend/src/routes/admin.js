const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/admin');
const { User, Job, Application, Payment, Message } = require('../models');
const { Op } = require('sequelize');
const os = require('os');
const fs = require('fs');
const path = require('path');

// POST /api/admin/make-admin - Make user admin (temporary route)
router.post('/make-admin', async (req, res) => {
  try {
    const { email, secret } = req.body;
    
    // Simple secret check
    if (secret !== 'CreavoDev2024') {
      return res.status(403).json({ error: 'Invalid secret' });
    }
    
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    await user.update({ isAdmin: true });
    res.json({ message: 'User is now admin', user: { id: user.id, email: user.email, isAdmin: user.isAdmin } });
  } catch (error) {
    console.error('Make admin error:', error);
    res.status(500).json({ error: 'Failed to make user admin' });
  }
});

// GET /api/admin/stats - System-Statistiken
router.get('/stats', isAdmin, async (req, res) => {
  try {
    // Datenbank-Statistiken
    const totalUsers = await User.count();
    const freelancers = await User.count({ where: { userType: 'freelancer' } });
    const clients = await User.count({ where: { userType: 'client' } });
    
    const totalJobs = await Job.count();
    const activeJobs = await Job.count({ where: { status: 'open' } });
    const completedJobs = await Job.count({ where: { status: 'completed' } });
    
    const totalApplications = await Application.count();
    const pendingApplications = await Application.count({ where: { status: 'pending' } });
    const acceptedApplications = await Application.count({ where: { status: 'accepted' } });
    
    const totalPayments = await Payment.count();
    const totalRevenue = await Payment.sum('amount', { where: { status: 'captured' } }) || 0;
    const escrowAmount = await Payment.sum('amount', { where: { status: 'authorized' } }) || 0;
    
    const totalMessages = await Message.count();
    
    // Neue User (letzte 7 Tage)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newUsers = await User.count({
      where: { createdAt: { [Op.gte]: sevenDaysAgo } }
    });
    
    // System-Informationen
    const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
    let uploadsDirSize = 0;
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      files.forEach(file => {
        const stats = fs.statSync(path.join(uploadsDir, file));
        uploadsDirSize += stats.size;
      });
    }
    
    const systemInfo = {
      platform: os.platform(),
      arch: os.arch(),
      hostname: os.hostname(),
      totalMemory: (os.totalmem() / 1024 / 1024 / 1024).toFixed(2) + ' GB',
      freeMemory: (os.freemem() / 1024 / 1024 / 1024).toFixed(2) + ' GB',
      cpus: os.cpus().length,
      uptime: (os.uptime() / 60 / 60).toFixed(2) + ' Stunden',
      nodeVersion: process.version,
      uploadsDirSize: (uploadsDirSize / 1024 / 1024).toFixed(2) + ' MB'
    };
    
    res.json({
      database: {
        users: { total: totalUsers, freelancers, clients, newThisWeek: newUsers },
        jobs: { total: totalJobs, active: activeJobs, completed: completedJobs },
        applications: { total: totalApplications, pending: pendingApplications, accepted: acceptedApplications },
        payments: { total: totalPayments, revenue: parseFloat(totalRevenue).toFixed(2), escrow: parseFloat(escrowAmount).toFixed(2) },
        messages: totalMessages
      },
      system: systemInfo
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ error: 'Fehler beim Laden der Statistiken' });
  }
});

// GET /api/admin/users - Alle User anzeigen
router.get('/users', isAdmin, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email', 'firstName', 'lastName', 'userType', 'isAdmin', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit: 100
    });
    res.json(users);
  } catch (err) {
    console.error('Admin users error:', err);
    res.status(500).json({ error: 'Fehler beim Laden der User' });
  }
});

// GET /api/admin/jobs - Alle Jobs anzeigen
router.get('/jobs', isAdmin, async (req, res) => {
  try {
    const jobs = await Job.findAll({
      include: [{ model: User, as: 'client', attributes: ['firstName', 'lastName', 'email'] }],
      order: [['createdAt', 'DESC']],
      limit: 100
    });
    res.json(jobs);
  } catch (err) {
    console.error('Admin jobs error:', err);
    res.status(500).json({ error: 'Fehler beim Laden der Jobs' });
  }
});

// GET /api/admin/payments - Alle Zahlungen anzeigen
router.get('/payments', isAdmin, async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: [
        { 
          model: Application,
          include: [
            { model: User, as: 'freelancer', attributes: ['firstName', 'lastName', 'email'] },
            { model: Job, include: [{ model: User, as: 'client', attributes: ['firstName', 'lastName'] }] }
          ]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 50
    });
    res.json(payments);
  } catch (err) {
    console.error('Admin payments error:', err);
    res.status(500).json({ error: 'Fehler beim Laden der Zahlungen' });
  }
});

// DELETE /api/admin/users/:id - User löschen
router.delete('/users/:id', isAdmin, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User nicht gefunden' });
    
    await user.destroy();
    res.json({ message: 'User erfolgreich gelöscht' });
  } catch (err) {
    console.error('Admin delete user error:', err);
    res.status(500).json({ error: 'Fehler beim Löschen des Users' });
  }
});

// DELETE /api/admin/jobs/:id - Job löschen
router.delete('/jobs/:id', isAdmin, async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job nicht gefunden' });
    
    await job.destroy();
    res.json({ message: 'Job erfolgreich gelöscht' });
  } catch (err) {
    console.error('Admin delete job error:', err);
    res.status(500).json({ error: 'Fehler beim Löschen des Jobs' });
  }
});

// PUT /api/admin/users/:id - User bearbeiten
router.put('/users/:id', isAdmin, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User nicht gefunden' });
    
    await user.update(req.body);
    res.json(user);
  } catch (err) {
    console.error('Admin update user error:', err);
    res.status(500).json({ error: 'Fehler beim Aktualisieren des Users' });
  }
});

// PUT /api/admin/jobs/:id - Job bearbeiten
router.put('/jobs/:id', isAdmin, async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job nicht gefunden' });
    
    await job.update(req.body);
    res.json(job);
  } catch (err) {
    console.error('Admin update job error:', err);
    res.status(500).json({ error: 'Fehler beim Aktualisieren des Jobs' });
  }
});

// GET /api/admin/applications - Alle Bewerbungen anzeigen
router.get('/applications', isAdmin, async (req, res) => {
  try {
    const applications = await Application.findAll({
      include: [
        { model: User, as: 'freelancer', attributes: ['firstName', 'lastName', 'email'] },
        { model: Job, include: [{ model: User, as: 'client', attributes: ['firstName', 'lastName'] }] }
      ],
      order: [['createdAt', 'DESC']],
      limit: 100
    });
    res.json(applications);
  } catch (err) {
    console.error('Admin applications error:', err);
    res.status(500).json({ error: 'Fehler beim Laden der Bewerbungen' });
  }
});

// DELETE /api/admin/applications/:id - Bewerbung löschen
router.delete('/applications/:id', isAdmin, async (req, res) => {
  try {
    const application = await Application.findByPk(req.params.id);
    if (!application) return res.status(404).json({ error: 'Bewerbung nicht gefunden' });
    
    await application.destroy();
    res.json({ message: 'Bewerbung erfolgreich gelöscht' });
  } catch (err) {
    console.error('Admin delete application error:', err);
    res.status(500).json({ error: 'Fehler beim Löschen der Bewerbung' });
  }
});

module.exports = router;
