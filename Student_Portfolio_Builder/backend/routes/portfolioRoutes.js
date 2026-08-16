const express = require("express");
const router = express.Router();

const requireEditKey = require("../middleware/auth");
const {
  createPortfolio,
  getPortfolioBySlug,
  getPortfolioForEditor,
  updatePortfolio,
} = require("../controllers/portfolioController");

// Public
router.post("/", createPortfolio);
router.get("/slug/:slug", getPortfolioBySlug);

// Private (editor) - requires x-edit-key header
router.get("/:id/editor", requireEditKey, getPortfolioForEditor);
router.put("/:id", requireEditKey, updatePortfolio);

module.exports = router;
