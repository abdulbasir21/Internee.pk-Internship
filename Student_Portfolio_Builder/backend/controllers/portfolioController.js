const Portfolio = require("../models/Portfolio");
const Project = require("../models/Project");
const generateUniqueSlug = require("../utils/generateSlug");
const generateEditKey = require("../utils/generateKey");

// POST /api/portfolios
// Creates a brand new portfolio and returns its public slug + private edit key.
async function createPortfolio(req, res, next) {
  try {
    const { name, role, bio, avatarUrl, socialLinks } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }

    const slug = await generateUniqueSlug(name);
    const editKey = generateEditKey();

    const portfolio = await Portfolio.create({
      name: name.trim(),
      role,
      bio,
      avatarUrl,
      socialLinks,
      slug,
      editKey,
    });

    res.status(201).json({
      portfolio: {
        id: portfolio._id,
        name: portfolio.name,
        slug: portfolio.slug,
      },
      editKey, // returned once, must be stored client-side
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/portfolios/:slug  (public, read-only, no edit key needed)
async function getPortfolioBySlug(req, res, next) {
  try {
    const portfolio = await Portfolio.findOne({ slug: req.params.slug.toLowerCase() });
    if (!portfolio) {
      return res.status(404).json({ message: "Showcase not found" });
    }

    const projects = await Project.find({ portfolio: portfolio._id }).sort({ order: 1, createdAt: 1 });

    res.json({ portfolio, projects });
  } catch (err) {
    next(err);
  }
}

// GET /api/portfolios/id/:id/private  (used by the editor, requires edit key)
async function getPortfolioForEditor(req, res, next) {
  try {
    const portfolio = req.portfolio; // set by requireEditKey middleware
    const projects = await Project.find({ portfolio: portfolio._id }).sort({ order: 1, createdAt: 1 });
    res.json({ portfolio, projects });
  } catch (err) {
    next(err);
  }
}

// PUT /api/portfolios/:id  (requires edit key)
async function updatePortfolio(req, res, next) {
  try {
    const allowed = ["name", "role", "bio", "avatarUrl", "socialLinks"];
    const updates = {};
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const portfolio = await Portfolio.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({ portfolio });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createPortfolio,
  getPortfolioBySlug,
  getPortfolioForEditor,
  updatePortfolio,
};
