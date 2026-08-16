// routes/resumeRoutes.js
// Thin routing layer: just maps the endpoint to its controller.
const express = require('express');
const router = express.Router();
const { generateResume } = require('../controllers/resumeController');

// POST /api/generate-resume  ->  body: { personalInfo, skills, experience, education }
router.post('/generate-resume', generateResume);

module.exports = router;
