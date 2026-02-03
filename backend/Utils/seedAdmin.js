import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../Models/User.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from one level up (backend folder)
dotenv.config({ path: path.join(__dirname, "../.env") });

const seedAdmin = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in .env");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for seeding...");

    const email = "krishnam@gmail.com";
    const password = "password@123";

    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log("Admin account with this email already exists.");
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      name: "Krishnam Admin",
      email: email,
      password: hashedPassword,
      role: "ADMIN",
    });

    console.log("-----------------------------------------");
    console.log("Admin seeded successfully!");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log("-----------------------------------------");
    
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
