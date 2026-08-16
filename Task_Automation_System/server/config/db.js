const mongoose = require('mongoose');

// Single place to connect to MongoDB so server.js stays clean
async function connectDB() {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log('MongoDB connected');
  } catch (err) {
    // If the DB is unreachable the app is useless, so fail fast
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
