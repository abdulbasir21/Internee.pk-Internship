const nodemailer = require('nodemailer');

// One shared transporter for the whole app — created once, reused everywhere
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false, // true only for port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Wrapped in try/catch by callers — email failures should never crash the cron job
async function sendEmail(to, subject, text) {
  await transporter.sendMail({
    // EMAIL_FROM is the visible/verified sender shown to recipients.
    // It's often different from EMAIL_USER (the SMTP login) — e.g. Brevo's
    // SMTP login looks like "xxxx@smtp-brevo.com" and isn't a real inbox,
    // so it can't be used as the "from" address. Falls back to EMAIL_USER
    // for providers (like Gmail) where login and sender are the same.
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    text
  });
}

module.exports = { sendEmail };
