// routes/adminAuth.js
//
// Handles Admin SIGNUP and LOGIN.
// Note: in a real company you'd usually create only ONE admin manually,
// but we include a register route so you can create your first admin easily.

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const router = express.Router();

// POST /api/admin/register
// Creates a new admin account. Run this ONCE to create your admin login.
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "An admin with this email already exists." });
    }

    // Never save plain text passwords - we scramble (hash) it first.
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "Admin created successfully.", adminId: admin._id });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong.", error: err.message });
  }
});

// POST /api/admin/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Compare the password the user typed with the hashed one in the database.
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Create a token that proves this person is logged in as an admin.
    const token = jwt.sign(
      { id: admin._id, role: "admin", name: admin.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // token is valid for 1 day
    );

    res.json({
      token,
      user: { id: admin._id, name: admin.name, email: admin.email, role: "admin" },
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong.", error: err.message });
  }
});

module.exports = router;
