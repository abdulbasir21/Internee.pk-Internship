// Seeds exactly one Admin account. This is the ONLY way an Admin gets
// created — there is no admin signup route on purpose.
// Run with: node adminSeed.js  (or  npm run seed:admin)

require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');

async function seedAdmin() {
  await connectDB();

  const name = process.env.ADMIN_NAME || 'Admin';
  const email = (process.env.ADMIN_EMAIL || 'admin@example.com').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'changeme123';

  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`Admin already exists for ${email} — skipping.`);
    process.exit(0);
  }

  const hashed = await bcrypt.hash(password, 10);
  await User.create({ name, email, password: hashed, role: 'admin' });

  console.log(`Admin account created: ${email}`);
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error('Admin seed failed:', err);
  process.exit(1);
});
