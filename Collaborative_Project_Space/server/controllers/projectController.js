const Project = require('../models/Project');
const User = require('../models/User');
const { isNonEmptyString, isValidObjectId } = require('../utils/validators');

// POST /api/projects — admin only
// Creates a project and assigns initial members in one call.
const createProject = async (req, res) => {
  try {
    const { name, description, memberIds } = req.body;

    if (!isNonEmptyString(name)) {
      return res.status(400).json({ success: false, message: 'Project name is required' });
    }

    let members = [];
    if (Array.isArray(memberIds) && memberIds.length > 0) {
      // Only allow existing interns to be assigned as members
      const validIds = memberIds.filter(isValidObjectId);
      const interns = await User.find({ _id: { $in: validIds }, role: 'intern' });
      members = interns.map((u) => u._id);
    }

    const project = await Project.create({
      name,
      description: description || '',
      members,
      createdBy: req.user._id
    });

    res.status(201).json({ success: true, project });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error creating project' });
  }
};

// GET /api/projects — logged-in user
// Admin sees every project; intern sees only projects they're a member of.
const getProjects = async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { members: req.user._id };
    const projects = await Project.find(query)
      .populate('members', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, projects });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error fetching projects' });
  }
};

// GET /api/projects/:id — project details + members (isProjectMember already ran)
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('members', 'name email')
      .populate('createdBy', 'name email');

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.status(200).json({ success: true, project });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error fetching project' });
  }
};

// PATCH /api/projects/:id/members — admin only: add/remove interns
// Body: { add: [userId, ...], remove: [userId, ...] }
const updateMembers = async (req, res) => {
  try {
    const { add = [], remove = [] } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (Array.isArray(add) && add.length > 0) {
      const validAddIds = add.filter(isValidObjectId);
      const internsToAdd = await User.find({ _id: { $in: validAddIds }, role: 'intern' });
      internsToAdd.forEach((intern) => {
        const alreadyMember = project.members.some((m) => m.toString() === intern._id.toString());
        if (!alreadyMember) project.members.push(intern._id);
      });
    }

    if (Array.isArray(remove) && remove.length > 0) {
      project.members = project.members.filter(
        (memberId) => !remove.includes(memberId.toString())
      );
    }

    await project.save();
    const updated = await Project.findById(project._id).populate('members', 'name email');

    res.status(200).json({ success: true, project: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error updating project members' });
  }
};

module.exports = { createProject, getProjects, getProjectById, updateMembers };
