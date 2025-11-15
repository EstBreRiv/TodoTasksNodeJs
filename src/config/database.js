import { PrismaClient } from "../generated/prisma/index.js";

let prismaInstance = null;

export function getPrismaInstance() {
    if (!prismaInstance) {
        prismaInstance = new PrismaClient(
            {log: process.env.NODE_ENV === 'development' ? ['query'] : []}
        );
    }
    return prismaInstance;
}

export const closePrismaConnection = async () => {
    if (prismaInstance) {
        await prismaInstance.$disconnect();
        prismaInstance = null;
    }
}