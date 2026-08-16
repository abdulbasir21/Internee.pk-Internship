const Portfolio = require("../models/Portfolio");

/**
 * Confirms the request carries the correct private edit key for the
 * portfolio being modified. The key is issued once at creation time and
 * must be stored client-side (the frontend keeps it in localStorage).
 *
 * Looks for the portfolio id in req.params.portfolioId, or, for project
 * routes, resolves it from the project document first.
 */
async function requireEditKey(req, res, next) {
  try {
    const key = req.header("x-edit-key");
    if (!key) {
      return res.status(401).json({ message: "Missing edit key. Include x-edit-key header." });
    }

    let portfolioId = req.params.portfolioId || req.params.id;

    // Project-scoped routes attach the resolved portfolio id here (see projectController)
    if (req.resolvedPortfolioId) {
      portfolioId = req.resolvedPortfolioId;
    }

    const portfolio = await Portfolio.findById(portfolioId).select("+editKey");
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    if (portfolio.editKey !== key) {
      return res.status(403).json({ message: "Invalid edit key for this portfolio" });
    }

    req.portfolio = portfolio;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = requireEditKey;
