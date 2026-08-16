const mongoose = require('mongoose');

// Single place responsible for opening the DB connection.
// Called once from index.js on server startup.
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1); // no DB, no point staying up
  }
};

module.exports = connectDB;
