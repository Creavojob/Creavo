const express = require('express');
const router = express.Router();
const { authMiddleware, isClient } = require('../middleware/auth');
const jobService = require('../services/jobService');

// Create Job (Clients only)
router.post('/', authMiddleware, isClient, async (req, res) => {
  try {
    const { title, description, category, skills, budget, duration, experience } = req.body;
    
    if (!title || !description || !budget) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const job = await jobService.createJob(req.userId, {
      title,
      description,
      category,
      skills,
      budget,
      duration,
      experience
    });
    
    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get All Jobs
router.get('/', async (req, res) => {
  try {
    const { status, category, minBudget, limit, offset } = req.query;
    const userId = req.userId || null; // Falls authMiddleware vorhanden
    
    const jobs = await jobService.getJobs({
      status,
      category,
      minBudget,
      limit: parseInt(limit) || 20,
      offset: parseInt(offset) || 0
    }, userId);
    
    res.json(jobs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Job by ID
router.get('/:id', async (req, res) => {
  try {
    const userId = req.userId || null;
    const job = await jobService.getJobById(req.params.id, userId);
    res.json(job);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Update Job
router.put('/:id', authMiddleware, isClient, async (req, res) => {
  try {
    const job = await jobService.updateJob(req.params.id, req.userId, req.body);
    res.json(job);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete Job
router.delete('/:id', authMiddleware, isClient, async (req, res) => {
  try {
    const result = await jobService.deleteJob(req.params.id, req.userId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
