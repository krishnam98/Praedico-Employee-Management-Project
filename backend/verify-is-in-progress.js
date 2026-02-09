import mongoose from "mongoose";
import dotenv from "dotenv";
import Task from "./Models/Task.js";

dotenv.config();

const verifyData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        const tasks = await Task.find({ isInProgress: true });
        console.log(`Found ${tasks.length} tasks marked as isInProgress: true`);

        tasks.forEach(t => {
            console.log(`Task: ${t.title} (${t.taskId}), Status: ${t.status}, isInProgress: ${t.isInProgress}`);
        });

        // Also check all tasks that are overdue
        const overdueTasks = await Task.find({ status: "Overdue" });
        console.log(`Found ${overdueTasks.length} overdue tasks`);
        overdueTasks.forEach(t => {
            console.log(`Overdue Task: ${t.title} (${t.taskId}), Status: ${t.status}, isInProgress: ${t.isInProgress}`);
        });

        await mongoose.connection.close();
    } catch (error) {
        console.error("Error:", error);
    }
};

verifyData();
