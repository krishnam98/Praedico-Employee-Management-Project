import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./Models/User.js";
import dns from 'dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);
dotenv.config();

const findUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const email = "krishnam@gmail.com";
        const user = await User.findOne({ email });

        if (user) {
            console.log("--- USER FOUND ---");
            console.log(`Name: ${user.name}`);
            console.log(`Email: ${user.email}`);
            console.log(`Role: ${user.role}`);
            console.log(`IsActive: ${user.isActive}`);
            console.log(`ID: ${user._id}`);
        } else {
            console.log(`--- USER NOT FOUND: ${email} ---`);
            const allUsers = await User.find({}, 'email name role');
            console.log("Existing Users:");
            allUsers.forEach(u => console.log(`- ${u.name} (${u.email}) [${u.role}]`));
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error("Error:", err);
    }
};

findUser();
