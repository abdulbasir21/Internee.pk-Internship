const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    portfolio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Portfolio",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      required: [true, "Project description is required"],
      trim: true,
      maxlength: 2000,
    },
    images: {
      type: [String], // URLs, either uploaded (/uploads/..) or external
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    role: {
      type: String, // e.g. "Frontend Intern", "Data Analyst Intern"
      trim: true,
      maxlength: 120,
      default: "",
    },
    projectUrl: {
      type: String,
      trim: true,
      default: "",
    },
    repoUrl: {
      type: String,
      trim: true,
      default: "",
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
