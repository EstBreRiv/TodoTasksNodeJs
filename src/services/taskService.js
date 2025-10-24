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

