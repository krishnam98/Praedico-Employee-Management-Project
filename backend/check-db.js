import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./Models/User.js";
import Task from "./Models/Task.js";
import dns from 'dns';

// Set DNS to use system DNS instead of localhost
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const checkDb = async () => {
    try {
        console.log("Connecting to:", process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        const specificUser = await User.findOne({ email: "lti.05.aniket@gmail.com" });
        if (specificUser) {
            console.log(`FOUND_USER: ${specificUser.name} | Role: ${specificUser.role} | ID: ${specificUser._id} | Email: ${specificUser.email}`);
        } else {
            console.log("USER_NOT_FOUND for email: lti.05.aniket@gmail.com");
        }

        const users = await User.find({});
        console.log("--- USERS START ---");
        for (const u of users) {
            console.log(`U|${u.email}|${u.role}|${u.name}`);
        }
        console.log("--- USERS END ---");

        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    } catch (err) {
        console.error("Error in checkDb:", err);
    }
};

checkDb();
