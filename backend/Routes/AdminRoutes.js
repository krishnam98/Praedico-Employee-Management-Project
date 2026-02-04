import express from "express";
import { registerEmployee, getAllEmployees, deleteUser, toggleEmployeeStatus } from "../Controllers/AdminController.js";
import { protect } from "../Middlewares/AuthMiddleware.js";
import { authorizeRoles } from "../Middlewares/RoleMiddleware.js";

const router = express.Router();

// All routes in this file are protected and admin only
router.use(protect);
router.use(authorizeRoles("ADMIN"));

router.post("/employees/register", registerEmployee);
router.get("/employees", getAllEmployees);
router.delete("/users/:id", deleteUser);
router.patch("/employees/:id/toggle-status", toggleEmployeeStatus);

export default router;
