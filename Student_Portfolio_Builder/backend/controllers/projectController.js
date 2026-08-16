const Project = require("../models/Project");

// POST /api/portfolios/:portfolioId/projects  (requires edit key)
async function createProject(req, res, next) {
  try {
    const { title, description, tags, role, projectUrl, repoUrl } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Project title is required" });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ message: "Project description is required" });
    }

    const uploadedImages = (req.files || []).map((f) => `/uploads/${f.filename}`);
    const externalImages = Array.isArray(req.body.existingImages)
      ? req.body.existingImages
      : req.body.existingImages
      ? [req.body.existingImages]
      : [];

    const parsedTags = Array.isArray(tags)
      ? tags
      : typeof tags === "string" && tags.length
      ? tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const count = await Project.countDocuments({ portfolio: req.params.portfolioId });

    const project = await Project.create({
      portfolio: req.params.portfolioId,
      title: title.trim(),
      description: description.trim(),
      role,
      projectUrl,
      repoUrl,
      tags: parsedTags,
      images: [...externalImages, ...uploadedImages],
      order: count,
    });

    res.status(201).json({ project });
  } catch (err) {
    next(err);
  }
}

// PUT /api/projects/:id  (requires edit key; resolves portfolio first)
async function updateProject(req, res, next) {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const { title, description, tags, role, projectUrl, repoUrl, order } = req.body;

    if (title !== undefined) project.title = title.trim();
    if (description !== undefined) project.description = description.trim();
    if (role !== undefined) project.role = role;
    if (projectUrl !== undefined) project.projectUrl = projectUrl;
    if (repoUrl !== undefined) project.repoUrl = repoUrl;
    if (order !== undefined) project.order = order;

    if (tags !== undefined) {
      project.tags = Array.isArray(tags)
        ? tags
        : typeof tags === "string"
        ? tags.split(",").map((t) => t.trim()).filter(Boolean)
        : project.tags;
    }

    const uploadedImages = (req.files || []).map((f) => `/uploads/${f.filename}`);
    const existingImages = Array.isArray(req.body.existingImages)
      ? req.body.existingImages
      : req.body.existingImages
      ? [req.body.existingImages]
      : [];

    if (uploadedImages.length || req.body.existingImages !== undefined) {
      project.images = [...existingImages, ...uploadedImages];
    }

    await project.save();
    res.json({ project });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/projects/:id  (requires edit key)
async function deleteProject(req, res, next) {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project deleted", id: project._id });
  } catch (err) {
    next(err);
  }
}

module.exports = { createProject, updateProject, deleteProject };
