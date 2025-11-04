// src/app.js
import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/taskRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import rateLimit from "express-rate-limit";

const app = express();

app.set("trust proxy", 1); // Si estás detrás de un proxy, como en Heroku

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Registrar rutas
app.use("/", routes);
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);



// Middleware de manejo de errores
app.use(errorHandler);

// Exportar la app configurada
export default app;
