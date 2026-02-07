import express from "express";
import { getMyTasks, submitTask, getTaskSubmission, updateSubmission } from "../Controllers/TaskController.js";
import { protect } from "../Middlewares/AuthMiddleware.js";
import { authorizeRoles } from "../Middlewares/RoleMiddleware.js";
import upload from "../Middlewares/UploadMiddleware.js";

const router = express.Router();

router.use(protect);

// Employee routes
router.get("/my-tasks", authorizeRoles("EMPLOYEE", "ADMIN"), getMyTasks);
router.post("/submit", authorizeRoles("EMPLOYEE", "ADMIN"), upload.single("attachment"), submitTask);
router.get("/submissions/:taskId", authorizeRoles("EMPLOYEE", "ADMIN"), getTaskSubmission);
router.put("/submissions/:submissionId", authorizeRoles("EMPLOYEE", "ADMIN"), upload.single("attachment"), updateSubmission);

export default router;
