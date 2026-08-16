const mongoose = require("mongoose");

const socialLinksSchema = new mongoose.Schema(
  {
    github: { type: String, trim: true, default: "" },
    linkedin: { type: String, trim: true, default: "" },
    website: { type: String, trim: true, default: "" },
    email: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const portfolioSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 100,
    },
    role: {
      type: String, // e.g. "Software Engineering Intern @ Acme"
      trim: true,
      maxlength: 140,
      default: "",
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 600,
      default: "",
    },
    avatarUrl: {
      type: String,
      trim: true,
      default: "",
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    // Private key required to edit this portfolio. Never exposed on public routes.
    editKey: {
      type: String,
      required: true,
      select: false,
    },
    socialLinks: {
      type: socialLinksSchema,
      default: () => ({}),
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Portfolio", portfolioSchema);
