// routes/internAuth.js
//
// Handles Intern SIGNUP and LOGIN.
// Interns create their own account directly (self-signup) -
// no admin step is required to get started.

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Intern = require("../models/Intern");

const router = express.Router();

// POST /api/intern/signup
// Lets a new intern create their own account.
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, department } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    const existing = await Intern.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }

    // Never save plain text passwords - scramble (hash) it first.
    const hashedPassword = await bcrypt.hash(password, 10);

    const intern = await Intern.create({
      name,
      email,
      password: hashedPassword,
      department, // optional - defaults to "General" if not provided
    });

    // Log the intern straight in after signup, so they don't have to
    // fill the login form again right after registering.
    const token = jwt.sign(
      { id: intern._id, role: "intern", name: intern.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "Account created successfully.",
      token,
      user: {
        id: intern._id,
        name: intern.name,
        email: intern.email,
        department: intern.department,
        role: "intern",
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong.", error: err.message });
  }
});

// POST /api/intern/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const intern = await Intern.findOne({ email });
    if (!intern) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, intern.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: intern._id, role: "intern", name: intern.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: intern._id,
        name: intern.name,
        email: intern.email,
        department: intern.department,
        role: "intern",
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong.", error: err.message });
  }
});

module.exports = router;
