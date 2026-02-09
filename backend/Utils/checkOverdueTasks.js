import Task from "../Models/Task.js";

/**
 * Check and update overdue tasks
 * This function should be called periodically (e.g., via cron job or on each task fetch)
 */
export const checkAndUpdateOverdueTasks = async () => {
    try {
        const now = new Date();

        // Find tasks that are past deadline and not yet submitted or completed
        const result = await Task.updateMany(
            {
                deadline: { $lt: now },
                status: { $in: ["Created", "Pending", "In Progress"] }
            },
            {
                $set: { status: "Overdue" }
            }
        );

        return result;
    } catch (error) {
        console.error("Error checking overdue tasks:", error);
        throw error;
    }
};
