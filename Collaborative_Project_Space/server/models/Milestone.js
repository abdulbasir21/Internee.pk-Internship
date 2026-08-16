const mongoose = require('mongoose');

// NOTE: progress % is intentionally NOT a field here.
// It's always derived on the fly in utils/calculateMilestoneProgress.js
// by counting linked tasks, so it can never drift out of sync with the
// actual task statuses.
const milestoneSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  targetDate: {
    type: Date
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Milestone', milestoneSchema);
