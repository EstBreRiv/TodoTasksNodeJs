import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from "supertest";
import app from "../app.js";
import { PrismaClient } from "../generated/prisma/index.js";
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

describe("Post /auth/login", () => {
    
    // Crea usuario de prueba ANTES de los tests
    beforeAll(async () => {
        const hashedPassword = await bcrypt.hash("ebrenes", 10);
        
        await prisma.user.upsert({
            where: { email: "ebrenesTest@hco.com" },
            update: {},
            create: {
                email: "ebrenesTest@hco.com",
                password: hashedPassword,
                name: "Test User",
                roleId: 1, // Ajusta según tu BD
            }
        });
    });

    // Limpia después de los tests
    afterAll(async () => {
        await prisma.user.deleteMany({
            where: { email: "ebrenesTest@hco.com" }
        });
        await prisma.$disconnect();
    });

    it("should return 400 if request body is missing", async () => {
        const res = await request(app).post("/auth/login").send();
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Missing request body");
    });

    it("Should return 400 if email or password is invalid", async() => {
        const res = await request(app).post("/auth/login").send({
            email: "fake@example.com",
            password: "wrongpassword"
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Invalid email or password");
    });

    it("should return 200 and a token for valid credentials", async () => {
        const res = await request(app).post("/auth/login").send({
            email: "ebrenesTest@hco.com",
            password: "ebrenes"
        });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("token");
    });
});