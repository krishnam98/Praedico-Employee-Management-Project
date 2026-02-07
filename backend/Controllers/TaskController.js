import Task from "../Models/Task.js";
import TaskSubmission from "../Models/TaskSubmission.js";
import Counter from "../Models/Counter.js";
import { checkAndUpdateOverdueTasks } from "../Utils/checkOverdueTasks.js";

// Get tasks assigned to the current employee
export const getMyTasks = async (req, res) => {
    try {
        // Check and update overdue tasks before fetching
        await checkAndUpdateOverdueTasks();

        const tasks = await Task.find({ assignedTo: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Submit a task report
export const submitTask = async (req, res) => {
    try {
        const { taskId, title, description, attachment } = req.body;
        let finalAttachment = attachment;

        // If a file was uploaded, use its path
        if (req.file) {
            finalAttachment = req.file.path.replace(/\\/g, "/"); // Normalize path separators
        }

        // Generate submittedId
        const counter = await Counter.findOneAndUpdate(
            { id: "submittedId" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        const submittedId = `SUB-${counter.seq}`;

        const submission = await TaskSubmission.create({
            task: taskId,
            employee: req.user._id,
            title,
            description,
            attachment: finalAttachment,
            submittedId,
        });

        // Update task status to "Submitted" and record submission date
        await Task.findByIdAndUpdate(taskId, {
            status: "Submitted",
            submittedAt: new Date()
        });

        res.status(201).json({ success: true, data: submission });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get submission details for a specific task
export const getTaskSubmission = async (req, res) => {
    try {
        const { taskId } = req.params;
        const submission = await TaskSubmission.findOne({
            task: taskId,
            employee: req.user._id
        });
        res.status(200).json({ success: true, data: submission });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update/edit an existing submission (before deadline and admin approval)
export const updateSubmission = async (req, res) => {
    try {
        const { submissionId } = req.params;
        const { title, description, attachment } = req.body;

        // Find the submission and associated task
        const submission = await TaskSubmission.findOne({
            _id: submissionId,
            employee: req.user._id
        });

        if (!submission) {
            return res.status(404).json({ success: false, message: "Submission not found" });
        }

        // Get the task to check deadline and status
        const task = await Task.findById(submission.task);

        // Check if task is already completed (admin approved)
        if (task.status === "Completed") {
            return res.status(400).json({
                success: false,
                message: "Cannot edit - submission already approved by admin"
            });
        }

        // Check if deadline has passed
        if (task.deadline && new Date() > new Date(task.deadline)) {
            return res.status(400).json({
                success: false,
                message: "Cannot edit - deadline has passed"
            });
        }

        // Update the submission
        submission.title = title;
        submission.description = description;

        if (req.file) {
            submission.attachment = req.file.path.replace(/\\/g, "/");
        } else if (attachment !== undefined) {
            submission.attachment = attachment;
        }

        await submission.save();

        res.status(200).json({ success: true, data: submission });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
