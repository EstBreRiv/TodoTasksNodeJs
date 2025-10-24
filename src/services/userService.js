import { PrismaClient } from "../generated/prisma/index.js";


const prisma = new PrismaClient();

export const findUserByUsername = async (email) => {
    return await prisma.user.findUnique({ where: { email } });
}

export const createUser = async (data) => {
    return await prisma.user.create({ data });
}

export default prisma;