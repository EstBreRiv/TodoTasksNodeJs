import { services } from "../services/adapter.js";

export class TaskController {
  constructor() {
    this.taskService = services.taskService;
  }

  addTask = async (req, res) => {
    try {
      if (!req.body) {
        return res.status(400).json({ error: "Missing request body" });
      }

      const { title, description, priority, dueDate } = req.body;
      const userId = req.user.id;

      if (!title && !description) {
        return res
          .status(400)
          .json({ error: "Title and description is needed" });
      }

      const dateParsed = new Date(dueDate);

      const newTask = await this.taskService.createTask({
        title,
        description,
        userId: userId,
        priority,
        dueDate: dateParsed,
      });

      res.status(201).json({
        success: true,
        message: "Task created successfully",
        data: newTask,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  getAllTasks = async (req, res) => {
    try {
      const userId = req.user.id;

      const tasks = await this.taskService.getAllTasksByUserId(userId);

      if (!tasks || tasks.length === 0) {
        return res.status(404).json({ error: "No tasks found for this user" });
      }

      res.status(200).json({ tasks });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  getTaskById = async (req, res) => {
    try {
      const { id } = req.params;

      if (isNaN(parseInt(id))) {
        return res.status(400).json({ message: "Invalid task ID" });
      }

      const task = await this.taskService.findTaskById(parseInt(id));

      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.status(200).json({ task });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  getTaskByPriority = async (req, res) => {
    try {
      const { priority } = req.params;
      const userId = req.user.id;
      const filteredTasks = await this.taskService.getTaskByFilter({ userId, priority });

      if (filteredTasks.length === 0) {
        return res
          .status(404)
          .json({ error: "No tasks found with the specified priority" });
      }
      res.status(200).json({ tasks: filteredTasks });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  getTask = async (req, res) => {
    try {
      const userId = req.user.id; // viene del JWT
      const filters = { userId };

      // Extraer query params de la URL (ej: ?priority=High&dueDate=2025-10-30)
      const { priority, dueDate, status } = req.query;

      // Agregar condiciones dinámicamente
      if (priority) filters.priority = priority;
      if (dueDate) filters.dueDate = new Date(dueDate); // Prisma requiere formato Date válido
      if (status) filters.status = status;

      // 🔹 Llamar al servicio
      const filteredTasks = await this.taskService.getTaskByFilter(filters);

      // Validar si no hay resultados
      if (filteredTasks.length === 0) {
        return res
          .status(404)
          .json({ error: "No tasks found with the specified filters" });
      }

      // Retornar las tareas encontradas
      res.status(200).json({ tasks: filteredTasks });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  getTaskByDate = async (req, res) => {
    try {
      const { dueDate } = req.params;
      const userId = req.user.id;
      const filteredTasks = await this.taskService.getTaskByFilter({ userId, dueDate });
      if (filteredTasks.length === 0) {
        return res
          .status(404)
          .json({ error: "No tasks found with the specified due date" });
      }
      res.status(200).json({ tasks: filteredTasks });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  updateTaskById = async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, priority, dueDate, completed } = req.body;
      const updatedTask = await this.taskService.updateTask(parseInt(id), {
        title,
        description,
        priority,
        dueDate,
        completed,
      });

      if (!updatedTask) {
        return res.status(404).json({ error: "Task not found" });
      }

      res
        .status(200)
        .json({ message: "Task updated successfully", task: updatedTask });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  //Falta mejorar
  patchTaskById = async (req, res) => {
    try {
      const { id } = req.params;
      const taskData = req.body;
      const patchedTask = await this.taskService.updateTask(parseInt(id), taskData);

      if (!patchedTask) {
        return res.status(404).json({ error: "Task not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}

export const taskController = new TaskController(services.taskService);
