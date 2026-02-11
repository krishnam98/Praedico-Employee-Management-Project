import Task from "../Models/Task.js";
import TaskSubmission from "../Models/TaskSubmission.js";
import User from "../Models/User.js";
import Counter from "../Models/Counter.js";
import { checkAndUpdateOverdueTasks } from "../Utils/checkOverdueTasks.js";

// Create a new task and assign to employee
export const createTask = async (req, res) => {
    try {
        let { title, description, assignedTo, deadline, startDate } = req.body;

        // If assignedTo is a string (e.g. from FormData as JSON), parse it
        if (typeof assignedTo === "string") {
            try {
                assignedTo = JSON.parse(assignedTo);
            } catch (e) {
                // If not valid JSON, treat as single ID and wrap in array
                assignedTo = [assignedTo];
            }
        } else if (!Array.isArray(assignedTo)) {
            // Ensure it's an array even if single ID is sent directly
            assignedTo = [assignedTo];
        }


        let attachmentUrl = "";
        if (req.file) {
            // Use the Cloudinary secure URL
            attachmentUrl = req.file.path;
        } else if (req.body.attachment) {
            // Fallback to URL string if passed in body (from previous implementation)
            attachmentUrl = req.body.attachment;
        }

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
            startDate,
            deadline,
            attachment: attachmentUrl
        });

        res.status(201).json({ success: true, data: task });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all tasks (for admin dashboard)
export const getAllTasks = async (req, res) => {
    try {
        // Check and update overdue tasks before fetching
        await checkAndUpdateOverdueTasks();

        let query = {};
        // If Manager (Employee role), only show tasks they created/assigned
        if (req.user.role === "EMPLOYEE") {
            query.assignedBy = req.user._id;
        }

        const tasks = await Task.find(query)
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
        if (!submission) {
            return res.status(404).json({ success: false, message: "Submission not found" });
        }

        // Update submission status to Approved
        submission.status = "Approved";
        await submission.save();

        // Update task status to Completed
        await Task.findByIdAndUpdate(submission.task, { status: "Completed", rejectionReason: null });

        res.status(200).json({ success: true, message: "Submission approved and task completed" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Reject submission and update task status
export const rejectSubmission = async (req, res) => {
    try {
        const { rejectionReason } = req.body;
        const submission = await TaskSubmission.findById(req.params.submissionId);
        if (!submission) {
            return res.status(404).json({ success: false, message: "Submission not found" });
        }

        // Update submission status to Rejected
        submission.status = "Rejected";
        submission.rejectionReason = rejectionReason;
        await submission.save();

        // Update task status to Rejected (allowing resubmission or correction)
        await Task.findByIdAndUpdate(submission.task, {
            status: "Rejected",
            isInProgress: false,
            rejectionReason: rejectionReason
        });

        res.status(200).json({ success: true, message: "Submission rejected" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
