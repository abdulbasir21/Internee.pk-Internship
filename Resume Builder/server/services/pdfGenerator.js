// services/pdfGenerator.js
//
// Everything related to drawing the PDF lives in this file. Nothing here
// knows about Express, req/res, or HTTP — it just takes resume data and
// returns a PDF Buffer. That separation is what makes it swappable and
// testable on its own.

const PDFDocument = require('pdfkit');

// --- Layout constants -------------------------------------------------
// Centralized so spacing/colors stay consistent across every section
// instead of magic numbers scattered through the drawing functions.
const PAGE = { size: 'A4', margin: 50 };

const COLORS = {
  heading: '#1a2b4c', // deep navy — name + section titles
  text: '#2b2b2b', // near-black body text, easier on the eyes than pure black
  subtext: '#5a5a5a', // secondary info: dates, locations
  divider: '#c9ced6', // light gray rule lines
};

const FONTS = {
  heading: 'Helvetica-Bold',
  body: 'Helvetica',
  italic: 'Helvetica-Oblique',
};

const SIZES = {
  name: 24,
  sectionHeading: 13,
  jobTitle: 11.5,
  body: 10.5,
  small: 9.5,
};

/**
 * Generates a resume PDF and resolves with the finished file as a Buffer.
 * Buffering (rather than piping the live stream to res) keeps the
 * controller simple: it just sets headers and sends bytes, with no
 * risk of a half-written PDF reaching the client if generation throws.
 *
 * @param {object} data - validated resume data { personalInfo, skills, experience, education }
 * @param {string} [templateName] - which layout function to use (see TEMPLATES below)
 * @returns {Promise<Buffer>}
 */
function generateResumePDF(data, templateName = 'classic') {
  const renderTemplate = TEMPLATES[templateName] || TEMPLATES.classic;

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: PAGE.size, margin: PAGE.margin, bufferPages: true });

      const chunks = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      renderTemplate(doc, data);

      doc.end();
    } catch (err) {
      // Errors thrown synchronously during layout (e.g. bad data shape)
      // still need to reject the promise rather than crash the process.
      reject(err);
    }
  });
}

// -----------------------------------------------------------------------
// Template registry. Requirement 5 asks for "light-touch extensibility":
// a second template can be added later by writing another render function
// with the same (doc, data) signature and registering it here — nothing
// else in the app needs to change.
// -----------------------------------------------------------------------
const TEMPLATES = {
  classic: renderClassicTemplate,
};

/**
 * The one predefined template. Draws sections top to bottom in a fixed
 * order: header -> summary -> skills -> experience -> education.
 */
function renderClassicTemplate(doc, data) {
  const { personalInfo = {}, skills = [], experience = [], education = [] } = data;

  drawHeader(doc, personalInfo);

  if (isNonEmptyString(personalInfo.summary)) {
    drawSummary(doc, personalInfo.summary);
  }

  if (skills.length > 0) {
    drawSkillsSection(doc, skills);
  }

  if (experience.length > 0) {
    drawExperienceSection(doc, experience);
  }

  if (education.length > 0) {
    drawEducationSection(doc, education);
  }
}

// --- Section drawers -----------------------------------------------------

function drawHeader(doc, personalInfo) {
  doc.font(FONTS.heading).fontSize(SIZES.name).fillColor(COLORS.heading).text(personalInfo.name);

  // Contact line: only include the pieces that were actually provided,
  // joined with a middle-dot separator so missing fields don't leave
  // "  |  |  " gaps.
  const contactParts = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    personalInfo.linkedin,
  ].filter(isNonEmptyString);

  if (contactParts.length > 0) {
    doc
      .moveDown(0.2)
      .font(FONTS.body)
      .fontSize(SIZES.small)
      .fillColor(COLORS.subtext)
      .text(contactParts.join('   •   '));
  }

  doc.moveDown(0.6);
  drawDivider(doc, { thick: true });
  doc.moveDown(0.6);
}

function drawSummary(doc, summary) {
  ensureSpace(doc, 60);
  doc.font(FONTS.body).fontSize(SIZES.body).fillColor(COLORS.text).text(summary, {
    align: 'left',
    lineGap: 2,
  });
  doc.moveDown(0.9);
}

function drawSkillsSection(doc, skills) {
  ensureSpace(doc, 70);
  drawSectionHeading(doc, 'Skills');

  // Simple wrapping inline list rather than a pill/box grid — keeps the
  // layout resilient no matter how many skills come in, with zero risk
  // of overflow or overlapping boxes.
  doc
    .font(FONTS.body)
    .fontSize(SIZES.body)
    .fillColor(COLORS.text)
    .text(skills.filter(isNonEmptyString).join('   •   '), { lineGap: 3 });

  doc.moveDown(0.9);
}

function drawExperienceSection(doc, experience) {
  // Reserve enough room for the heading AND the first entry's title line
  // (not just the bare heading) so we never strand a lone heading at the
  // bottom of a page with its content pushed to the next one.
  ensureSpace(doc, 100);
  drawSectionHeading(doc, 'Experience');

  experience.forEach((entry, index) => {
    drawExperienceEntry(doc, entry);
    if (index < experience.length - 1) doc.moveDown(0.55);
  });

  doc.moveDown(0.9);
}

function drawExperienceEntry(doc, entry) {
  const { title, company, location, description } = entry;
  const dateRange = formatDateRange(entry);

  // Reserve a little space so a title line never gets orphaned alone
  // at the bottom of a page, separated from its own bullets.
  ensureSpace(doc, 45);

  const titleLine = [title, company].filter(isNonEmptyString).join(' — ');
  drawTwoColumnLine(doc, titleLine, dateRange, {
    font: FONTS.heading,
    size: SIZES.jobTitle,
    color: COLORS.heading,
  });

  if (isNonEmptyString(location)) {
    doc.font(FONTS.italic).fontSize(SIZES.small).fillColor(COLORS.subtext).text(location);
  }

  if (description) {
    doc.moveDown(0.15);
    drawBulletsOrParagraph(doc, description);
  }
}

function drawEducationSection(doc, education) {
  ensureSpace(doc, 100);
  drawSectionHeading(doc, 'Education');

  education.forEach((entry, index) => {
    drawEducationEntry(doc, entry);
    if (index < education.length - 1) doc.moveDown(0.5);
  });
}

function drawEducationEntry(doc, entry) {
  const { degree, school, location, details } = entry;
  const dateRange = formatDateRange(entry);

  ensureSpace(doc, 40);

  const titleLine = [degree, school].filter(isNonEmptyString).join(' — ');
  drawTwoColumnLine(doc, titleLine, dateRange, {
    font: FONTS.heading,
    size: SIZES.jobTitle,
    color: COLORS.heading,
  });

  if (isNonEmptyString(location)) {
    doc.font(FONTS.italic).fontSize(SIZES.small).fillColor(COLORS.subtext).text(location);
  }

  if (isNonEmptyString(details)) {
    doc.moveDown(0.1);
    doc.font(FONTS.body).fontSize(SIZES.body).fillColor(COLORS.text).text(details, { lineGap: 2 });
  }
}

// --- Small shared building blocks ----------------------------------------

function drawSectionHeading(doc, title) {
  doc.font(FONTS.heading).fontSize(SIZES.sectionHeading).fillColor(COLORS.heading).text(title.toUpperCase(), {
    characterSpacing: 0.5,
  });
  doc.moveDown(0.25);
  drawDivider(doc);
  doc.moveDown(0.4);
}

function drawDivider(doc, { thick = false } = {}) {
  const y = doc.y;
  doc
    .save()
    .moveTo(doc.page.margins.left, y)
    .lineTo(doc.page.width - doc.page.margins.right, y)
    .lineWidth(thick ? 1.2 : 0.75)
    .strokeColor(COLORS.divider)
    .stroke()
    .restore();
}

/**
 * Renders "left text ......... right text" on one line — used for
 * "Job Title — Company" paired with its date range. Falls back to a
 * single line if there's no right-hand text.
 */
function drawTwoColumnLine(doc, leftText, rightText, style) {
  const { font, size, color } = style;
  const usableWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const startY = doc.y;

  if (!isNonEmptyString(rightText)) {
    doc.font(font).fontSize(size).fillColor(color).text(leftText);
    return;
  }

  // Measure the date text first so the title column knows how much width
  // it has left to wrap into before colliding with the date.
  doc.font(FONTS.body).fontSize(SIZES.small);
  const rightWidth = doc.widthOfString(rightText);
  const leftWidth = usableWidth - rightWidth - 10;

  doc.font(font).fontSize(size).fillColor(color);
  const leftHeight = doc.heightOfString(leftText, { width: leftWidth });

  // Both pieces are drawn at explicit x/y coordinates, which means PDFKit
  // does NOT auto-advance the shared cursor the way normal flowing text
  // does. We restore doc.x/doc.y ourselves afterwards so the next call
  // (a location line, a bullet list, etc.) starts fresh at the left
  // margin below whichever column is taller.
  doc.text(leftText, doc.page.margins.left, startY, { width: leftWidth });

  doc
    .font(FONTS.body)
    .fontSize(SIZES.small)
    .fillColor(COLORS.subtext)
    .text(rightText, doc.page.width - doc.page.margins.right - rightWidth, startY, {
      width: rightWidth,
      lineBreak: false,
    });

  doc.x = doc.page.margins.left;
  doc.y = startY + Math.max(leftHeight, size * 1.15) + 2;
}

/**
 * Experience/education descriptions may arrive as either a plain string
 * or an array of bullet strings from the frontend — support both so the
 * template doesn't break depending on how the form captured the data.
 */
function drawBulletsOrParagraph(doc, description) {
  const bullets = Array.isArray(description) ? description.filter(isNonEmptyString) : [description];

  bullets.forEach((line) => {
    doc
      .font(FONTS.body)
      .fontSize(SIZES.body)
      .fillColor(COLORS.text)
      .text(`•  ${line}`, {
        indent: 0,
        lineGap: 2,
      });
  });
}

/**
 * Formats a date range from either a pre-built `duration` string or
 * separate startDate/endDate fields, so the frontend can send whichever
 * shape is easiest to capture from its form.
 */
function formatDateRange(entry) {
  if (isNonEmptyString(entry.duration)) return entry.duration;
  if (isNonEmptyString(entry.startDate)) {
    return `${entry.startDate} - ${isNonEmptyString(entry.endDate) ? entry.endDate : 'Present'}`;
  }
  return '';
}

/**
 * Manually forces a page break before drawing a heading/entry if there
 * isn't enough room left, so we never end up with an orphaned heading
 * (or a job title with no room for its bullets) at the bottom of a page.
 * Plain flowing `doc.text()` calls already auto-paginate on their own;
 * this only guards the spots where we draw multiple related pieces
 * (heading + divider, title + bullets) that should stay together.
 */
function ensureSpace(doc, minHeight) {
  const bottom = doc.page.height - doc.page.margins.bottom;
  if (doc.y + minHeight > bottom) {
    doc.addPage();
  }
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

module.exports = { generateResumePDF };
