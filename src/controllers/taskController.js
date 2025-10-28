import {
  findTaskById,
  createTask,
  getAllTasksByUserId,
  updateTask,
  getTaskByFilter,
} from "../services/taskService.js";

export const addTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;
    const userId = req.user.id;

    if (!title && !description) {
      return res.status(400).json({ error: "Title and description is needed" });
    }

    const newTask = await createTask({
      title,
      description,
      userId: userId,
      priority,
      dueDate,
    });

    res
      .status(201)
      .json({ message: "Task created succecsfully", task: newTask });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const userId = req.user.id;

    const tasks = await getAllTasksByUserId(userId);

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ error: "No tasks found for this user" });
    }

    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await findTaskById(parseInt(id));

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTaskByPriority = async (req, res) => {
  try {
    const { priority } = req.params;
    const userId = req.user.id;
    const filteredTasks = await getTaskByFilter({ userId, priority });

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

export const getTask = async (req, res) => {
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
    const filteredTasks = await getTaskByFilter(filters);

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

export const getTaskByDate = async (req, res) => {
  try {
    const { dueDate } = req.params;
    const userId = req.user.id;
    const filteredTasks = await getTaskByFilter({ userId, dueDate });
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

export const updateTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, dueDate, completed } = req.body;
    const updatedTask = await updateTask(parseInt(id), {
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
export const patchTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const taskData = req.body;
    const patchedTask = await updateTask(parseInt(id), taskData);

    if (!patchedTask) {
      return res.status(404).json({ error: "Task not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export default {
  addTask,
  getAllTasks,
  getTaskById,
  getTaskByPriority,
  getTaskByDate,
  updateTaskById,
  patchTaskById,
  getTask,
};