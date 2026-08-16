const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const requireEditKey = require("../middleware/auth");
const Project = require("../models/Project");
const { createProject, updateProject, deleteProject } = require("../controllers/projectController");

// Resolves req.resolvedPortfolioId from an existing project id so
// requireEditKey can validate ownership before update/delete.
async function resolvePortfolioFromProject(req, res, next) {
  try {
    const project = await Project.findById(req.params.id).select("portfolio");
    if (!project) return res.status(404).json({ message: "Project not found" });
    req.resolvedPortfolioId = project.portfolio;
    next();
  } catch (err) {
    next(err);
  }
}

// Create a project under a portfolio
router.post(
  "/portfolios/:portfolioId/projects",
  requireEditKey,
  upload.array("images", 6),
  createProject
);

// Update / delete a single project
router.put(
  "/projects/:id",
  resolvePortfolioFromProject,
  requireEditKey,
  upload.array("images", 6),
  updateProject
);
router.delete("/projects/:id", resolvePortfolioFromProject, requireEditKey, deleteProject);

module.exports = router;
