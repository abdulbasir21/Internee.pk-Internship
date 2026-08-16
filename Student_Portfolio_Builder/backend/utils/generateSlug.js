const slugify = require("slugify");
const { nanoid } = require("nanoid");
const Portfolio = require("../models/Portfolio");

/**
 * Builds a unique, URL-friendly slug from a display name.
 * Falls back to appending a short random suffix on collision.
 */
async function generateUniqueSlug(name) {
  const base = slugify(name || "intern", { lower: true, strict: true }) || "intern";
  let candidate = base;
  let attempt = 0;

  // eslint-disable-next-line no-await-in-loop
  while (await Portfolio.exists({ slug: candidate })) {
    attempt += 1;
    candidate = `${base}-${nanoid(5).toLowerCase()}`;
    if (attempt > 10) break; // safety valve
  }

  return candidate;
}

module.exports = generateUniqueSlug;
