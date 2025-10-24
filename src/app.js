// src/app.js
import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Registrar rutas
app.use("/", routes);
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

// Exportar la app configurada
export default app;
