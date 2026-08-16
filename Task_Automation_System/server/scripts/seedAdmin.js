// One-off script to create the admin account, since admins can't sign up
// through the API. Run with: npm run seed:admin
require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');

async function seedAdmin() {
  const { DB_URI, ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('Set ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD in .env before seeding');
    process.exit(1);
  }

  await mongoose.connect(DB_URI);

  const existing = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });
  if (existing) {
    console.log('Admin already exists:', existing.email);
    await mongoose.disconnect();
    return;
  }

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const admin = await User.create({
    name: ADMIN_NAME || 'Admin',
    email: ADMIN_EMAIL.toLowerCase(),
    password: hashedPassword,
    role: 'admin'
  });

  console.log('Admin created:', admin.email);
  await mongoose.disconnect();
}

seedAdmin().catch((err) => {
  console.error('Seeding failed:', err.message);
  process.exit(1);
});
