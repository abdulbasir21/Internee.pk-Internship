// Small, dependency-free validation helpers.
// Kept simple on purpose — no schema-validation library needed for this scope.

function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isValidDate(value) {
  const d = new Date(value);
  return !isNaN(d.getTime());
}

module.exports = { isValidEmail, isNonEmptyString, isValidDate };
