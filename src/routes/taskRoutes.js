import express from "express";
import taskController from "../controllers/taskController.js";
import { verifyToken, authorizeRole } from "../middlewares/authMiddleware.js";
import { taskValidationRules, validateTask } from "../validators/taskValidator.js";
import { limiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/", verifyToken, limiter, taskValidationRules, validateTask, taskController.addTask);

router.get("/filter", verifyToken, limiter, taskController.getTask);

router.get("/getTasks", verifyToken, authorizeRole("admin"), limiter, taskController.getAllTasks);

router.get("/:id", verifyToken, limiter, taskController.getTaskById);

router.get("/priority/:priority", verifyToken, limiter, taskController.getTaskByPriority);

//Arreglar ruta para fecha
router.get("/date/:dueDate", verifyToken, limiter, taskController.getTaskByDate);

router.put("/:id", verifyToken, limiter, taskController.updateTaskById);

router.patch("/:id", verifyToken, limiter, taskController.patchTaskById);

export default router;
