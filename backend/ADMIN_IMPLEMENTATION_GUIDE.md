# Admin Side Implementation Guide

## Overview
This document outlines what needs to be implemented on the **Admin side** to work with the already-completed **Employee side** task functionality.

---

## What's Already Done (Employee Side)

✅ **Backend Models**: `Task` and `TaskSubmission` models are created
✅ **Employee API Routes**: Employees can view tasks and submit reports
✅ **Employee UI**: Tasks page with submission modal
✅ **Database Collections**: `tasks` and `tasksubmissions` collections are ready

---

## What Admin Needs to Implement

### 1. Backend - Task Creation & Management

#### Required API Endpoints

Create these routes in a new file or add to existing admin routes:

**File**: `backend/Routes/AdminTaskRoutes.js` (or add to existing `AdminRoutes.js`)

```javascript
import express from "express";
import { protect } from "../Middlewares/AuthMiddleware.js";
import { authorizeRoles } from "../Middlewares/RoleMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(authorizeRoles("ADMIN"));

// Task Management
router.post("/tasks/create", createTask);           // Create new task
router.get("/tasks/all", getAllTasks);              // View all tasks
router.put("/tasks/:taskId", updateTask);           // Update task status
router.delete("/tasks/:taskId", deleteTask);        // Delete task

// Submission Management
router.get("/submissions/all", getAllSubmissions);  // View all submissions
router.get("/submissions/:taskId", getTaskSubmissions); // View submissions for specific task
router.put("/submissions/:submissionId/approve", approveSubmission); // Approve submission

export default router;
```

#### Required Controller Functions

**File**: `backend/Controllers/AdminTaskController.js`

```javascript
import Task from "../Models/Task.js";
import TaskSubmission from "../Models/TaskSubmission.js";
import User from "../Models/User.js";
import Counter from "../Models/Counter.js";

// Create a new task and assign to employee
export const createTask = async (req, res) => {
    try {
        const { title, description, assignedTo, deadline } = req.body;

        // Generate taskId
        const counter = await Counter.findOneAndUpdate(
            { id: "taskId" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        const taskId = `TSK-${counter.seq}`;

        const task = await Task.create({
            title,
            description,
            status: "Created",
            assignedTo,
            assignedBy: req.user._id,
            taskId,
            deadline
        });

        res.status(201).json({ success: true, data: task });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all tasks (for admin dashboard)
export const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({})
            .populate("assignedTo", "name email employeeId")
            .populate("assignedBy", "name")
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update task (change status, deadline, etc.)
export const updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const updates = req.body;

        const task = await Task.findByIdAndUpdate(taskId, updates, { new: true });
        res.status(200).json({ success: true, data: task });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete task
export const deleteTask = async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.taskId);
        res.status(200).json({ success: true, message: "Task deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all submissions
export const getAllSubmissions = async (req, res) => {
    try {
        const submissions = await TaskSubmission.find({})
            .populate("task", "title taskId")
            .populate("employee", "name email employeeId")
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: submissions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get submissions for a specific task
export const getTaskSubmissions = async (req, res) => {
    try {
        const submissions = await TaskSubmission.find({ task: req.params.taskId })
            .populate("employee", "name email employeeId");
        res.status(200).json({ success: true, data: submissions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Approve submission and update task status
export const approveSubmission = async (req, res) => {
    try {
        const submission = await TaskSubmission.findById(req.params.submissionId);
        
        // Update task status to Completed
        await Task.findByIdAndUpdate(submission.task, { status: "Completed" });
        
        res.status(200).json({ success: true, message: "Submission approved and task completed" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
```

---

### 2. Frontend - Admin UI Components

#### Required Pages/Components

**A. Task Creation Page**
- Form to create new tasks
- Fields: Title, Description, Assign to Employee (dropdown), Deadline
- Submit button to call `POST /api/admin/tasks/create`

**B. All Tasks Dashboard**
- Table/List showing all tasks
- Columns: Task ID, Title, Assigned To, Status, Deadline, Actions
- Actions: Edit, Delete, View Submissions
- Fetch from `GET /api/admin/tasks/all`

**C. Task Submissions View**
- List of all employee submissions
- Show: Submission ID, Task Title, Employee Name, Submitted Date
- Action: Approve button
- Fetch from `GET /api/admin/submissions/all`

**D. Task Detail/Edit Modal**
- View task details
- Update status (Created → Work In Progress → Completed)
- Update deadline
- Call `PUT /api/admin/tasks/:taskId`

---

### 3. Integration Points

#### How Admin & Employee Sides Work Together

1. **Admin creates task** → Saved in `tasks` collection with `assignedTo` = employee's User ID
2. **Employee views tasks** → Fetches from `tasks` where `assignedTo` matches their ID
3. **Employee submits report** → Saved in `tasksubmissions` collection
4. **Admin views submissions** → Fetches from `tasksubmissions` collection
5. **Admin approves** → Updates task status in `tasks` collection to "Completed"

---

### 4. Database Schema Reference

#### Task Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  status: "Created" | "Work In Progress" | "Completed" | "Overdue",
  assignedTo: ObjectId (User),  // Employee's User ID
  assignedBy: ObjectId (User),  // Admin's User ID
  taskId: String,               // e.g., "TSK-1001"
  deadline: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### TaskSubmission Collection
```javascript
{
  _id: ObjectId,
  task: ObjectId (Task),        // Reference to Task
  employee: ObjectId (User),    // Employee who submitted
  title: String,
  description: String,
  status: "Submitted",
  attachment: String,           // Optional URL/link
  submittedId: String,          // e.g., "SUB-10000"
  createdAt: Date,
  updatedAt: Date
}
```

---

### 5. Example API Calls

#### Create Task
```javascript
POST /api/admin/tasks/create
Headers: { Authorization: "Bearer <admin-token>" }
Body: {
  "title": "Complete Monthly Report",
  "description": "Prepare and submit the monthly performance report",
  "assignedTo": "67a46ed06efc6dec46ed9608",  // Employee's User ID
  "deadline": "2026-02-15T00:00:00.000Z"
}
```

#### Get All Tasks
```javascript
GET /api/admin/tasks/all
Headers: { Authorization: "Bearer <admin-token>" }
```

#### Approve Submission
```javascript
PUT /api/admin/submissions/:submissionId/approve
Headers: { Authorization: "Bearer <admin-token>" }
```

---

### 6. UI Design Suggestions

#### Task Creation Form
```
┌─────────────────────────────────────┐
│  Create New Task                    │
├─────────────────────────────────────┤
│  Title: [________________]          │
│  Description: [____________]        │
│  Assign To: [Select Employee ▼]    │
│  Deadline: [Date Picker]            │
│  [Cancel]  [Create Task]            │
└─────────────────────────────────────┘
```

#### Tasks Dashboard
```
┌────────────────────────────────────────────────────────────┐
│  Task ID  │  Title        │  Assigned To  │  Status  │ ... │
├────────────────────────────────────────────────────────────┤
│  TSK-1001 │  Monthly Rpt  │  aniket       │  Created │ ... │
│  TSK-1002 │  Update Docs  │  john         │  WIP     │ ... │
└────────────────────────────────────────────────────────────┘
```

---

### 7. Testing Checklist

Before going live, test:
- [ ] Admin can create tasks
- [ ] Tasks appear in employee's task list
- [ ] Employee can submit reports
- [ ] Admin can view submissions
- [ ] Admin can approve submissions
- [ ] Task status updates to "Completed" after approval
- [ ] Admin can edit/delete tasks

---

## Quick Start

1. Copy the controller functions to `backend/Controllers/AdminTaskController.js`
2. Create routes in `backend/Routes/AdminTaskRoutes.js`
3. Register routes in `backend/index.js`:
   ```javascript
   import adminTaskRoutes from "./Routes/AdminTaskRoutes.js";
   app.use("/api/admin", adminTaskRoutes);
   ```
4. Build the frontend UI components
5. Test the complete workflow

---

## Questions?

If you need clarification on any part, refer to:
- `TASK_DATA_STRUCTURE.md` - Detailed data structure documentation
- `backend/Models/Task.js` - Task model definition
- `backend/Models/TaskSubmission.js` - TaskSubmission model definition
- `backend/Controllers/TaskController.js` - Employee-side controller (for reference)

Good luck with the admin implementation!
