import express from "express";
import { registerEmployee, getAllEmployees, updateEmployee, getAllManagers, deleteUser, toggleEmployeeStatus, getEmployeesByDesignation } from "../Controllers/AdminController.js";
import { protect } from "../Middlewares/AuthMiddleware.js";
import { authorizeRoles, authorizeAdminOrManager } from "../Middlewares/RoleMiddleware.js";

const router = express.Router();

// All routes in this file are protected and available to Admin OR Managers
router.use(protect);
router.use(authorizeAdminOrManager);

router.post("/employees/register", registerEmployee);
router.get("/employees", getAllEmployees);
router.put("/employees/:id", updateEmployee);
router.get("/managers", getAllManagers);
router.delete("/users/:id", deleteUser);
router.patch("/employees/:id/toggle-status", toggleEmployeeStatus);
router.get("/employees-by-designation", getEmployeesByDesignation);

export default router;
