import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./Models/User.js";
import Task from "./Models/Task.js";
import { connectDB } from "./Config/db.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

const cleanup = async () => {
    try {
        await connectDB();
        
        // Find user Aviral
        const user = await User.findOne({ name: { $regex: /^aviral$/i } });
        
        if (!user) {
            console.log("User Aviral not found");
            process.exit(0);
        }
        
        console.log(`Found user: ${user.name} (${user._id})`);
        
        // Delete tasks assigned to this user
        const result = await Task.deleteMany({ assignedTo: user._id });
        
        console.log(`Deleted ${result.deletedCount} tasks for ${user.name}`);
        
        process.exit(0);
    } catch (error) {
        console.error("Cleanup failed:", error);
        process.exit(1);
    }
};

cleanup();
