const Milestone = require('../models/Milestone');
const calculateMilestoneProgress = require('../utils/calculateMilestoneProgress');
const { isNonEmptyString } = require('../utils/validators');

// POST /api/projects/:id/milestones — admin only
const createMilestone = async (req, res) => {
  try {
    const { title, targetDate } = req.body;
    const projectId = req.params.id;

    if (!isNonEmptyString(title)) {
      return res.status(400).json({ success: false, message: 'Milestone title is required' });
    }

    const milestone = await Milestone.create({
      title,
      targetDate: targetDate || null,
      projectId
    });

    res.status(201).json({ success: true, milestone });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error creating milestone' });
  }
};

// GET /api/projects/:id/milestones — isProjectMember already confirmed access
// Returns each milestone WITH its progress %, computed at request time by
// counting linked tasks (see utils/calculateMilestoneProgress.js).
const getProjectMilestones = async (req, res) => {
  try {
    const milestones = await Milestone.find({ projectId: req.params.id }).sort({ createdAt: 1 });

    const milestonesWithProgress = await Promise.all(
      milestones.map(async (milestone) => {
        const progressData = await calculateMilestoneProgress(milestone._id);
        return {
          ...milestone.toObject(),
          ...progressData
        };
      })
    );

    res.status(200).json({ success: true, milestones: milestonesWithProgress });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error fetching milestones' });
  }
};

module.exports = { createMilestone, getProjectMilestones };
