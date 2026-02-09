import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectDB } from "./Config/db.js";
import authRoutes from "./Routes/AuthRoutes.js";
import adminRoutes from "./Routes/AdminRoutes.js";
import userRoutes from "./Routes/UserRoutes.js";
import taskRoutes from "./Routes/TaskRoutes.js";
import adminTaskRoutes from "./Routes/AdminTaskRoutes.js";


import path from "path";
import { fileURLToPath } from "url";
import Task from "./Models/Task.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });
connectDB();

const app = express();

app.use(express.json());
app.use(cors({
  origin: [process.env.FRONTEND_URL || "http://localhost:3000", "http://localhost:3001"],
  credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/admin", adminTaskRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
