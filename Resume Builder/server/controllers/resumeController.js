// controllers/resumeController.js
// Bridges HTTP and the service layer: validate input, call the PDF service,
// send the response. No PDFKit code and no validation rules live here.

const { validateResumeData } = require('../utils/validators');
const { generateResumePDF } = require('../services/pdfGenerator');

async function generateResume(req, res) {
  const { valid, errors } = validateResumeData(req.body);

  if (!valid) {
    return res.status(400).json({ error: 'Invalid resume data.', details: errors });
  }

  try {
    const pdfBuffer = await generateResumePDF(req.body);

    const safeName = (req.body.personalInfo.name || 'resume')
      .trim()
      .replace(/[^a-z0-9]+/gi, '_')
      .toLowerCase();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${safeName}_resume.pdf"`,
      'Content-Length': pdfBuffer.length,
    });

    return res.status(200).send(pdfBuffer);
  } catch (err) {
    // PDF generation failed after validation passed — this is a server-side
    // problem (e.g. unexpected data shape slipping past validation), not a
    // client error, so it's a 500 with a generic message.
    console.error('PDF generation failed:', err);
    return res.status(500).json({ error: 'Failed to generate PDF resume.' });
  }
}

module.exports = { generateResume };
