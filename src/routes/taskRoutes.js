import express from "express";
import {taskController} from "../controllers/taskController.js";
import { verifyToken, authorizeRole } from "../middlewares/authMiddleware.js";
import { taskValidationRules, validateTask } from "../validators/taskValidator.js";
import { limiter } from "../middlewares/rateLimiter.js";
import swaggerJSDoc from "swagger-jsdoc";

const router = express.Router();

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Crear una nueva tarea
 *     description: Crea una nueva tarea para el usuario autenticado
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 100
 *                 description: Título de la tarea
 *                 example: "Primer tarea de la lista"
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 description: Descripción detallada de la tarea, usar formato YYYY-MM-DD
 *                 example: "Esta es la descripción de mi primera tarea"
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 description: Fecha límite
 *                 example: "2025-12-31"
 *               priority:
 *                 type: string
 *                 enum: [Low, Medium, High]
 *                 description: Prioridad de la tarea
 *                 example: "High"
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, completed]
 *                 default: pending
 *                 description: Estado inicial (opcional)
 *                 example: "pending"
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Validation Error"
 *               message: "El título es requerido"
 *       401:
 *         description: No autorizado - Token inválido o no proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Unauthorized"
 *               message: "Token no proporcionado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", verifyToken, limiter, taskValidationRules, validateTask, taskController.addTask);


/**
 * @swagger
 * /tasks/filter:
 *   get:
 *     summary: Busca una tarea según filtros, la tarea debe pertenecer al usuario autenticado
 *     description: Busca tareas del usuario autenticado según filtros opcionales como prioridad, fecha de vencimiento y estado.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, in_progress, completed]
 *         description: Filtrar por estado (opcional)
 *         example: "pending"
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [Low, Medium, High]
 *         description: Filtrar por prioridad (opcional)
 *         example: "High"
 *     responses:
 *       200:
 *         description: Tarea encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: No tasks found with the specified filters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *            
 *       
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/filter", verifyToken, limiter, taskController.getTask);


/**
 * @swagger
 * /tasks/getTasks:
 *   get:
 *     summary: Obtener todas las tareas (Admin only)
 *     description: Retorna todas las tareas en el sistema. Solo accesible para usuarios con rol Admin.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tarea encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: No tasks found for this user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Not Found"
 *               message: "Tarea no encontrada"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Forbidden"
 *               message: "No tienes permiso para acceder a esta tarea"
 */
router.get("/getTasks", verifyToken, authorizeRole("Admin"), limiter, taskController.getAllTasks);


/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Obtener una tarea específica
 *     description: Retorna los detalles de una tarea por su ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la tarea
 *         example: 1
 *     responses:
 *       200:
 *         description: Tarea encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Tarea no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Not Found"
 *               message: "Tarea no encontrada"
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Prohibido - No tienes acceso a esta tarea
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Forbidden"
 *               message: "No tienes permiso para acceder a esta tarea"
 */
router.get("/:id", verifyToken, limiter, taskController.getTaskById);

router.get("/priority/:priority", verifyToken, limiter, taskController.getTaskByPriority);

//Arreglar ruta para fecha
router.get("/date/:dueDate", verifyToken, limiter, taskController.getTaskByDate);


/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Actualizar una tarea
 *     description: Actualiza los campos de una tarea existente
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la tarea a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Título actualizado"
 *               description:
 *                 type: string
 *                 example: "Nueva descripción"
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, completed]
 *                 example: "in_progress"
 *               priority:
 *                 type: string
 *                 enum: [Low, Medium, High]
 *                 example: "Medium"
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-01-15"
 *     responses:
 *       200:
 *         description: Tarea actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Tarea no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permiso para editar esta tarea
 */
router.put("/:id", verifyToken, limiter, taskController.updateTaskById);


/**
 * @swagger
 * /tasks/{id}:
 *   patch:
 *     summary: Actualizar una tarea
 *     description: Actualiza los campos de una tarea existente
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la tarea a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Título actualizado"
 *               description:
 *                 type: string
 *                 example: "Nueva descripción"
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, completed]
 *                 example: "in_progress"
 *               priority:
 *                 type: string
 *                 enum: [Low, Medium, High]
 *                 example: "Medium"
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-01-15"
 *     responses:
 *       200:
 *         description: Tarea actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Tarea no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permiso para editar esta tarea
 */
router.patch("/:id", verifyToken, limiter, taskController.patchTaskById);

export default router;
