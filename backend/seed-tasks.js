import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./Models/User.js";
import Task from "./Models/Task.js";
import path from "path";
import { fileURLToPath } from "url";
import dns from 'dns';

// Set DNS to use system DNS instead of localhost
dns.setServers(['8.8.8.8', '8.8.4.4']);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

const seedTasks = async () => {
    try {
        console.log("Connecting to:", process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        let employee = await User.findOne({ email: "lti.05.aniket@gmail.com" });
        if (!employee) {
            employee = await User.findOne({ name: /aniket/i });
        }
        if (!employee) {
            employee = await User.findOne({ role: "EMPLOYEE" });
        }

        const admin = await User.findOne({ role: "ADMIN" });

        if (!employee || !admin) {
            console.error("Need at least one EMPLOYEE and one ADMIN to seed tasks.");
            process.exit(1);
        }

        console.log(`Clearing old tasks and seeding for employee: ${employee.name} (${employee._id})`);

        // Delete ALL tasks first to ensure a clean slate as requested for rollback/verification
        await Task.deleteMany({});
        console.log("Deleted all existing tasks.");

        const tasks = [
            {
                title: "Register New Employees",
                description: "Complete the registration for the 5 new hires in the engineering department.",
                status: "Created",
                assignedTo: employee._id,
                assignedBy: admin._id,
                taskId: "TSK-1001",
                deadline: new Date(Date.now() + 86400000 * 2), // 2 days from now
            },
            {
                title: "Update Project Documentation",
                description: "Review and update the project documentation for the upcoming release.",
                status: "Work In Progress",
                assignedTo: employee._id,
                assignedBy: admin._id,
                taskId: "TSK-1002",
                deadline: new Date(Date.now() + 86400000 * 5), // 5 days from now
            }
        ];

        await Task.insertMany(tasks);
        console.log("Seeded 2 tasks successfully.");

        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    } catch (err) {
        console.error("Error seeding tasks:", err);
    }
};

seedTasks();
