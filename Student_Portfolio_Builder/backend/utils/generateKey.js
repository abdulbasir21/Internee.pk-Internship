const { nanoid } = require("nanoid");

/**
 * Generates a private edit key handed to the creator once, on portfolio
 * creation. It must be supplied (as x-edit-key header) for any future
 * write operation on that portfolio or its projects.
 */
function generateEditKey() {
  return nanoid(24);
}

module.exports = generateEditKey;
