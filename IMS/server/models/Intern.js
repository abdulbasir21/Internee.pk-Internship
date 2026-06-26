// models/Intern.js
// This describes what an "Intern" record looks like.
// Admins create these when onboarding a new intern.

const mongoose = require("mongoose");

const internSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true, // encrypted, set by admin when onboarding (intern can be told this password)
    },
    department: {
      type: String,
      default: "General",
    },
    joiningDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Intern", internSchema);
