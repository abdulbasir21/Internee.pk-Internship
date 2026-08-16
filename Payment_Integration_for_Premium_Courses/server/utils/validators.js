// Small, dependency-free validation helpers. Kept simple on purpose —
// no validation library needed for a project this size.

function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isPositiveNumber(value) {
  return typeof value === 'number' && !Number.isNaN(value) && value >= 0;
}

module.exports = { isValidEmail, isNonEmptyString, isPositiveNumber };
