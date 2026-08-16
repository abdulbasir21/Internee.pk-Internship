// server.js
// Entry point. Keeps only app wiring here — routes/controllers/services own the logic.
const express = require('express');
const cors = require('cors');
const resumeRoutes = require('./routes/resumeRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Frontend runs on a different origin (e.g. localhost:5173), so CORS must be open for it to call this API.
app.use(cors());

// Resume form data arrives as JSON. 1mb is generous for text-only resume content.
app.use(express.json({ limit: '1mb' }));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api', resumeRoutes);

// Catch-all error handler. Anything thrown/passed via next(err) anywhere in the
// app lands here so we always send a clean JSON error instead of an HTML stack trace.
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Something went wrong while processing your request.' });
});

app.listen(PORT, () => {
  console.log(`Resume builder backend running on http://localhost:${PORT}`);
});
