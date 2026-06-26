// models/Task.js
// This describes a single Task that an admin assigns to an intern.
// Status + deadline are kept simple, and we add a "submission" field
// so interns can submit their work as text (a link, notes, summary, etc.)

const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "done"], // status can ONLY be one of these two values
      default: "pending",
    },
    deadline: {
      type: Date,
      required: true,
    },
    // What the intern submits when their work is ready - a text note,
    // a link to their work (GitHub, Google Doc, etc.), or a short summary.
    submission: {
      type: String,
      default: "",
    },
    submittedAt: {
      type: Date,
      default: null,
    },
    // This links the task to ONE specific intern.
    // "ref: Intern" tells Mongoose this ID belongs to the Intern collection.
    intern: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Intern",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
