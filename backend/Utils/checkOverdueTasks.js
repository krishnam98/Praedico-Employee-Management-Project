import Task from "../Models/Task.js";

/**
 * Check and update overdue tasks
 * This function should be called periodically (e.g., via cron job or on each task fetch)
 */
export const checkAndUpdateOverdueTasks = async () => {
    try {
        const now = new Date();

        // We no longer overwrite the status to "Overdue" in the database.
        // Instead, the frontend calculates overdue status based on the deadline.
        // This allows tasks to be counted in their respective categories (In Progress, Submitted, etc.)
        // even if they are overdue.
        
        /*
        const result = await Task.updateMany(
            {
                deadline: { $lt: now },
                status: { $in: ["Created", "Pending", "In Progress"] }
            },
            {
                $set: { status: "Overdue" }
            }
        );
        */

        return { success: true, message: "Overdue check skipped (handled by frontend)" };
    } catch (error) {
        console.error("Error checking overdue tasks:", error);
        throw error;
    }
};
