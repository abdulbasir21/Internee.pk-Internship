// models/Admin.js
// This file describes what an "Admin" looks like in the database.
// Mongoose calls this a "Schema" - think of it as a table structure.

const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // no two admins can have the same email
    },
    password: {
      type: String,
      required: true, // this will be stored ENCRYPTED, never plain text
    },
  },
  { timestamps: true } // automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model("Admin", adminSchema);
