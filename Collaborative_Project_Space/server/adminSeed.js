// Seeds exactly one Admin account into the database.
// This is the ONLY way an Admin account ever gets created — there is no
// admin signup route on purpose, to keep admin creation out of the public API.
//
// Run with: npm run seed:admin   (or: node adminSeed.js)
// Requires ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, and MONGO_URI in .env

require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');

const seedAdmin = async () => {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('Missing ADMIN_NAME, ADMIN_EMAIL, or ADMIN_PASSWORD in .env');
    process.exit(1);
  }

  await connectDB();

  const existingAdmin = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });
  if (existingAdmin) {
    console.log(`Admin already exists for ${ADMIN_EMAIL} — nothing to do.`);
    process.exit(0);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

  const admin = await User.create({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL.toLowerCase(),
    password: hashedPassword,
    role: 'admin'
  });

  console.log(`Admin account created: ${admin.email}`);
  process.exit(0);
};

seedAdmin().catch((err) => {
  console.error('Failed to seed admin:', err);
  process.exit(1);
});
