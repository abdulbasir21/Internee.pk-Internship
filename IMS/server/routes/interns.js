// routes/interns.js
//
// These routes let the ADMIN manage intern profiles:
// Create (manually add an intern), Read (view all), Update, Delete.
// All routes here require the user to be logged in AND be an admin.
//
// Note: interns can ALSO create their own account themselves via
// POST /api/intern/signup - this admin route is an alternative way
// for the admin to add an intern directly, if needed.

const express = require("express");
const bcrypt = require("bcryptjs");
const Intern = require("../models/Intern");
const { protect, allowRoles } = require("../middleware/auth");

const router = express.Router();

// Every route below first runs "protect" (must be logged in)
// then "allowRoles('admin')" (must be an admin specifically)
router.use(protect, allowRoles("admin"));

// POST /api/interns  -> Onboard a new intern
router.post("/", async (req, res) => {
  try {
    const { name, email, password, department } = req.body;

    const existing = await Intern.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "An intern with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const intern = await Intern.create({
      name,
      email,
      password: hashedPassword,
      department,
    });

    // Don't send the password back, even hashed - just confirm creation.
    res.status(201).json({
      message: "Intern onboarded successfully.",
      intern: { id: intern._id, name: intern.name, email: intern.email, department: intern.department },
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong.", error: err.message });
  }
});

// GET /api/interns  -> List all interns (without showing passwords)
router.get("/", async (req, res) => {
  try {
    const interns = await Intern.find().select("-password");
    res.json(interns);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong.", error: err.message });
  }
});

// PUT /api/interns/:id  -> Update an intern's basic info
router.put("/:id", async (req, res) => {
  try {
    const { name, department } = req.body;

    const intern = await Intern.findByIdAndUpdate(
      req.params.id,
      { name, department },
      { new: true } // return the updated document
    ).select("-password");

    if (!intern) {
      return res.status(404).json({ message: "Intern not found." });
    }

    res.json({ message: "Intern updated.", intern });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong.", error: err.message });
  }
});

// DELETE /api/interns/:id  -> Remove an intern
router.delete("/:id", async (req, res) => {
  try {
    const intern = await Intern.findByIdAndDelete(req.params.id);
    if (!intern) {
      return res.status(404).json({ message: "Intern not found." });
    }
    res.json({ message: "Intern removed." });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong.", error: err.message });
  }
});

module.exports = router;
