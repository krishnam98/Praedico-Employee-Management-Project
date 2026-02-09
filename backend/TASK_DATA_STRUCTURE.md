# Task Assignment Data Structure

## Overview
This document shows how task data is structured when an admin assigns tasks to employees.

## Database Collections

### 1. Task Collection (for admin-assigned tasks)
When an admin assigns a task to an employee, it creates a document in the `tasks` collection:

```javascript
{
  _id: ObjectId("67a47d0a908664440da47d0a"),  // MongoDB auto-generated ID
  title: "Register New Employees",
  description: "Complete the registration for the 5 new hires in the engineering department.",
  status: "Created",  // Can be: "Created", "Work In Progress", "Completed", "Overdue"
  assignedTo: ObjectId("67a46ed06efc6dec46ed9608"),  // Employee's User ID
  assignedBy: ObjectId("67a3510c750115e3510c7501"),  // Admin's User ID
  taskId: "TSK-1001",  // Unique task identifier
  deadline: ISODate("2026-02-08T07:06:44.000Z"),  // Optional deadline
  createdAt: ISODate("2026-02-06T07:06:44.263Z"),
  updatedAt: ISODate("2026-02-06T07:06:44.263Z"),
  __v: 0
}
```

### 2. TaskSubmission Collection (for employee submissions)
When an employee submits a report for a task, it creates a document in the `tasksubmissions` collection:

```javascript
{
  _id: ObjectId("..."),
  task: ObjectId("67a47d0a908664440da47d0a"),  // References the Task ID
  employee: ObjectId("67a46ed06efc6dec46ed9608"),  // Employee's User ID
  title: "Registration Report",
  description: "Completed registration for all 5 new hires...",
  status: "Submitted",
  attachment: "https://example.com/report.pdf",  // Optional attachment URL
  submittedId: "SUB-10000",  // Auto-generated submission ID
  createdAt: ISODate("..."),
  updatedAt: ISODate("..."),
  __v: 0
}
```

## Key Points

1. **assignedTo** field in Task must match the employee's `_id` from the Users collection
2. **assignedBy** field in Task should be the admin's `_id` from the Users collection
3. **taskId** is a human-readable identifier (e.g., "TSK-1001")
4. **submittedId** is auto-generated using a Counter collection (starts at SUB-10000)

## User Information
For reference, the test user:
- Name: aniket
- Email: lti.05.aniket@gmail.com
- Role: EMPLOYEE
- User ID: 67a46ed06efc6dec46ed9608

## API Endpoints

### Employee Side
- `GET /api/tasks/my-tasks` - Fetch tasks assigned to logged-in employee
- `POST /api/tasks/submit` - Submit a task report
- `GET /api/tasks/submissions/:taskId` - Get submission for a specific task

### Admin Side (To be implemented by your friend)
- Admin will need routes to:
  - Create new tasks
  - Assign tasks to employees
  - View all tasks
  - View task submissions
