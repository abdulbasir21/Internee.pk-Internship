// server.js
//
// This is the MAIN file that starts the backend server.
// It connects to MongoDB and tells Express which routes to use.

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const adminAuthRoutes = require("./routes/adminAuth");
const internAuthRoutes = require("./routes/internAuth");
const internRoutes = require("./routes/interns");
const taskRoutes = require("./routes/tasks");

const app = express();

// --- Middleware ---
app.use(cors()); // allows the React frontend (different port) to talk to this backend
app.use(express.json()); // lets us read JSON data sent in requests (req.body)

// --- Routes ---
// Every URL starting with /api/admin goes to adminAuth.js, and so on.
app.use("/api/admin", adminAuthRoutes);
app.use("/api/intern", internAuthRoutes);
app.use("/api/interns", internRoutes);
app.use("/api/tasks", taskRoutes);

// Simple test route to check the server is alive
app.get("/", (req, res) => {
  res.send("Intern Tracker API is running.");
});

// --- Connect to MongoDB, then start the server ---
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully.");
    
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
  });
