import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

export const findTaskById = async (id) => {
    return await prisma.task.findUnique({ where: { id } });
}

export const createTask = async (data) => {
    return await prisma.task.create({ data });
}

export const updateTask = async (id, data) => {
    return await prisma.task.update({ where: { id }, data });
}

export const deleteTask = async (id) => {
    return await prisma.task.delete({ where: { id } });
}

export const getAllTasksByUserId = async (userId) => {
    return await prisma.task.findMany({ where: { userId } });
}

export const getTaskByFilter = async (filter) => {
    return await prisma.task.findMany({ where: filter });
}

