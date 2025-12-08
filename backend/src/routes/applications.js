const express = require('express');
const router = express.Router();
const { authMiddleware, isFreelancer, isClient } = require('../middleware/auth');
const applicationService = require('../services/applicationService');

// Submit Application
router.post('/', authMiddleware, isFreelancer, async (req, res) => {
  try {
    const { jobId, bidAmount, coverLetter } = req.body;
    
    if (!jobId || !bidAmount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const application = await applicationService.submitApplication(
      jobId,
      req.userId,
      bidAmount,
      coverLetter
    );
    
    res.status(201).json(application);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Applications
router.get('/', authMiddleware, async (req, res) => {
  try {
    const applications = await applicationService.getApplications(req.userId, req.userType);
    res.json(applications);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get single Application by id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const application = await applicationService.getApplicationById(req.params.id, req.userId, req.userType);
    res.json(application);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Accept Application
router.put('/:id/accept', authMiddleware, isClient, async (req, res) => {
  try {
    const result = await applicationService.acceptApplication(req.params.id, req.userId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update Application Status
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const result = await applicationService.updateStatus(req.params.id, status, req.userId, req.userType);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Submit Completion
router.put('/:id/completion', authMiddleware, async (req, res) => {
  try {
    const { userType } = req.body;
    const result = await applicationService.submitCompletion(req.params.id, userType);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Complete Application (Release Funds)
router.put('/:id/complete', authMiddleware, async (req, res) => {
  try {
    const result = await applicationService.completeApplication(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
