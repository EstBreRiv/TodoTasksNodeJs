import express from "express";
import taskController from "../controllers/taskController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { taskValidationRules, validateTask } from "../validators/taskValidator.js";

const router = express.Router();

router.post("/", verifyToken, taskValidationRules, validateTask, taskController.addTask);

router.get("/filter", verifyToken, taskController.getTask);

router.get("/getTasks", verifyToken, taskController.getAllTasks);

router.get("/:id", verifyToken, taskController.getTaskById);

router.get("/priority/:priority", verifyToken, taskController.getTaskByPriority);

//Arreglar ruta para fecha
router.get("/date/:dueDate", verifyToken, taskController.getTaskByDate);

router.put("/:id", verifyToken, taskController.updateTaskById);

router.patch("/:id", verifyToken, taskController.patchTaskById);

export default router;
