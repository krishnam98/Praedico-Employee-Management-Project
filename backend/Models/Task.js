import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ["Created", "Pending", "In Progress", "Submitted", "Completed", "Overdue", "Rejected"],
    default: "Created"
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Employee ID
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Admin ID
  taskId: { type: String, required: true, unique: true },
  deadline: { type: Date },
  attachment: { type: String }, // URL or file path for task attachment
  isInProgress: { type: Boolean, default: false }, // Tracks if employee is currently working
  rejectionReason: { type: String }, // Reason why the task was rejected
  taskStarted: { type: Date },
  marks: { type: Number, default: 0 }, // Marks/score for the task
  submittedAt: { type: Date } // Date when employee submitted the task
}, { timestamps: true });

export default mongoose.model("Task", taskSchema);
