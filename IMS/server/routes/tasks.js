// routes/tasks.js
//
// Task routes are used by BOTH admin and intern, but they can do different things:
// - Admin: create tasks, assign to interns, view all tasks, delete tasks
// - Intern: view ONLY their own tasks, update the STATUS of their own tasks

const express = require("express");
const Task = require("../models/Task");
const { protect, allowRoles } = require("../middleware/auth");

const router = express.Router();

// Every route here requires the user to be logged in (admin OR intern)
router.use(protect);

// POST /api/tasks  -> Admin creates and assigns a new task
router.post("/", allowRoles("admin"), async (req, res) => {
  try {
    const { title, description, deadline, intern } = req.body;

    const task = await Task.create({ title, description, deadline, intern });

    res.status(201).json({ message: "Task created and assigned.", task });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong.", error: err.message });
  }
});

// GET /api/tasks  -> Get tasks
// - If admin: returns ALL tasks (with intern name attached)
// - If intern: returns ONLY tasks belonging to that intern
router.get("/", async (req, res) => {
  try {
    let tasks;

    if (req.user.role === "admin") {
      tasks = await Task.find().populate("intern", "name email department");
    } else {
      tasks = await Task.find({ intern: req.user.id });
    }

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong.", error: err.message });
  }
});

// PUT /api/tasks/:id/status  -> Intern updates the status of their OWN task
router.put("/:id/status", allowRoles("intern"), async (req, res) => {
  try {
    const { status } = req.body; // expected: "pending" or "done"

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    // Security check: make sure this task actually belongs to the logged-in intern.
    // Without this, an intern could try to update someone else's task by guessing the ID.
    if (task.intern.toString() !== req.user.id) {
      return res.status(403).json({ message: "This is not your task." });
    }

    task.status = status;
    await task.save();

    res.json({ message: "Task status updated.", task });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong.", error: err.message });
  }
});

// PUT /api/tasks/:id/submit  -> Intern submits their work for a task
router.put("/:id/submit", allowRoles("intern"), async (req, res) => {
  try {
    const { submission } = req.body; // a text note or link describing the finished work

    if (!submission || !submission.trim()) {
      return res.status(400).json({ message: "Please write something before submitting." });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    // Same ownership check as the status route - interns can only submit their own work.
    if (task.intern.toString() !== req.user.id) {
      return res.status(403).json({ message: "This is not your task." });
    }

    task.submission = submission;
    task.submittedAt = new Date();
    task.status = "done"; // submitting work marks the task as done automatically
    await task.save();

    res.json({ message: "Work submitted.", task });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong.", error: err.message });
  }
});

// PUT /api/tasks/:id  -> Admin edits a task's details (title/description/deadline)
router.put("/:id", allowRoles("admin"), async (req, res) => {
  try {
    const { title, description, deadline } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, deadline },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    res.json({ message: "Task updated.", task });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong.", error: err.message });
  }
});

// DELETE /api/tasks/:id  -> Admin deletes a task
router.delete("/:id", allowRoles("admin"), async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }
    res.json({ message: "Task deleted." });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong.", error: err.message });
  }
});

module.exports = router;
