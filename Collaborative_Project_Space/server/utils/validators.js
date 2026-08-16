// Small, dependency-free validation helpers.
// Kept simple on purpose — no validation library, per the "no
// over-engineering" requirement.

const isValidEmail = (email) => {
  return typeof email === 'string' && /^\S+@\S+\.\S+$/.test(email);
};

const isNonEmptyString = (value) => {
  return typeof value === 'string' && value.trim().length > 0;
};

const isValidStatus = (status) => {
  return ['todo', 'in-progress', 'done'].includes(status);
};

const isValidObjectId = (id) => {
  return typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);
};

module.exports = {
  isValidEmail,
  isNonEmptyString,
  isValidStatus,
  isValidObjectId
};
