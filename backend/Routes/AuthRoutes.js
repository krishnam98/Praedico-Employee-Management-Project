import express from "express";
import { register, login, getMe } from "../Controllers/AuthController.js";
import { protect } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

// Register route
router.post("/register", register);

router.post("/login", login);

// Get current user profile
router.get("/me", protect, getMe);

export default router;
