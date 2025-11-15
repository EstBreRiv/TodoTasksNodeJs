import { TaskService } from "./taskService.js";
import {getPrismaInstance} from "../config/database.js";

export const taskServices = (prismaClient = getPrismaInstance()) => {
    return {
        taskService: new TaskService(prismaClient),

    }
}

export const services = taskServices();
