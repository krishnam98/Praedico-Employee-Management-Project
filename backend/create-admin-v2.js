import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./Models/User.js";
import dns from 'dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);
dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const email = "krishnam@gmail.com";
        const password = "password123"; // Dummy password

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log(`User ${email} already exists.`);
            existingUser.role = "ADMIN";
            const salt = await bcrypt.genSalt(10);
            existingUser.password = await bcrypt.hash(password, salt);
            await existingUser.save();
            console.log(`Updated user ${email} to ADMIN with password: ${password}`);
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            await User.create({
                name: "Krishnam",
                email,
                password: hashedPassword,
                role: "ADMIN"
            });
            console.log(`Created ADMIN user: ${email} with password: ${password}`);
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error("Error creating admin:", err);
    }
};

createAdmin();
