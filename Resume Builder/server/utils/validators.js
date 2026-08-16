// utils/validators.js
// Pure validation logic, kept separate from Express so it's easy to unit test
// and easy to reuse if we ever add another entry point (e.g. a CLI).

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates the incoming resume payload.
 * We only hard-require the fields that make a resume usable at all
 * (name + email). Everything else (skills, experience, education) is
 * optional so the PDF generator must handle "empty section" gracefully.
 *
 * @param {object} body - raw req.body
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateResumeData(body) {
  const errors = [];

  if (!body || typeof body !== 'object') {
    return { valid: false, errors: ['Request body must be a JSON object.'] };
  }

  const { personalInfo, skills, experience, education } = body;

  // --- personalInfo: the only required section ---
  if (!personalInfo || typeof personalInfo !== 'object') {
    errors.push('personalInfo is required.');
  } else {
    if (!isNonEmptyString(personalInfo.name)) {
      errors.push('personalInfo.name is required.');
    }
    if (!isNonEmptyString(personalInfo.email)) {
      errors.push('personalInfo.email is required.');
    } else if (!EMAIL_REGEX.test(personalInfo.email.trim())) {
      errors.push('personalInfo.email must be a valid email address.');
    }
  }

  // --- optional sections: just type-check so the PDF layout logic never
  // has to guard against, say, "skills" being a string instead of an array ---
  if (skills !== undefined && !Array.isArray(skills)) {
    errors.push('skills must be an array if provided.');
  }
  if (experience !== undefined && !Array.isArray(experience)) {
    errors.push('experience must be an array if provided.');
  }
  if (education !== undefined && !Array.isArray(education)) {
    errors.push('education must be an array if provided.');
  }

  return { valid: errors.length === 0, errors };
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

module.exports = { validateResumeData };
