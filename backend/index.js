import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectDB } from "./Config/db.js";
import authRoutes from "./Routes/AuthRoutes.js";
import adminRoutes from "./Routes/AdminRoutes.js";

dotenv.config();
connectDB();
const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
