import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";
import { PrismaClient } from "../generated/prisma/index.js";
import bcrypt from "bcryptjs";

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
      },
    });
  });

  // Limpia después de los tests
  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: "ebrenesTest@hco.com" },
    });
    await prisma.$disconnect();
  });

  it("should return 400 if request body is missing", async () => {
    const res = await request(app).post("/auth/login").send();
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Missing request body");
  });

  it("Should return 400 if email or password is invalid", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "fake@example.com",
      password: "wrongpassword",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid email or password");
  });

  it("should return 200 and a token for valid credentials", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "ebrenesTest@hco.com",
      password: "ebrenes",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});

describe("Post /auth/register", () => {
  beforeEach(async () => {
    await prisma.user.deleteMany({
      where: {
        email: {
          in: ["ebrenesTest@hco.com", "duplicate@hco.com"],
        },
      },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: {
          in: ["ebrenesTest@hco.com", "duplicate@hco.com"],
        },
      },
    });
    await prisma.$disconnect();
  });

  it("should return 400 if required fields are missing", async () => {
    const res = await request(app).post("/auth/register").send({});

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("errors"); // ← Formato del validator
    expect(res.body.errors).toBeInstanceOf(Array);
    expect(res.body.errors.length).toBeGreaterThan(0);

    // Verifica que incluya errores de email, name y password
    const errorFields = res.body.errors.map((e) => e.path);
    expect(errorFields).toContain("email");
    expect(errorFields).toContain("name");
    expect(errorFields).toContain("password");
  });

  it("should return 400 if email format is invalid", async () => {
    const res = await request(app).post("/auth/register").send({
      email: "invalid-email", // ← Email inválido
      password: "password123",
      name: "Test User",
      role: "User",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeInstanceOf(Array);

    const emailError = res.body.errors.find((e) => e.path === "email");
    expect(emailError).toBeDefined();
    expect(emailError.msg).toBe("Invalid email address");
  });

  it("should return 400 if password is too short", async () => {
    const res = await request(app).post("/auth/register").send({
      email: "test@hco.com",
      password: "123", // ← Menos de 6 caracteres
      name: "Test User",
      role: "User",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeInstanceOf(Array);

    const passwordError = res.body.errors.find((e) => e.path === "password");
    expect(passwordError).toBeDefined();
    expect(passwordError.msg).toBe(
      "Password must be at least 6 characters long"
    );
  });

  it("should return 400 if email already exists", async () => {
    // Crea usuario primero
    await request(app).post("/auth/register").send({
      email: "duplicate@hco.com",
      password: "password123",
      name: "First User",
      role: "User",
    });

    // Intenta crear el mismo email
    const res = await request(app).post("/auth/register").send({
      email: "duplicate@hco.com",
      password: "password456",
      name: "Second User",
      role: "User",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Email already exists");
  });

  it("should return 201 and create user for valid data", async () => {
    const res = await request(app).post("/auth/register").send({
      email: "ebrenesTest@hco.com",
      password: "ebrenes123", // ← Asegúrate que tenga 6+ caracteres
      name: "Test User",
      role: "User",
    });

    expect(res.statusCode).toBe(201);

    // Ajusta según el formato de tu controller
    // Si retornas { message: "Usuario creado", user: {...} }
    //expect(res.body).toHaveProperty("user");
    //expect(res.body.user).toHaveProperty("id");
    //(res.body.user.email).toBe("ebrenesTest@hco.com");

    // O si cambiaste a retornar el usuario directamente
    expect(res.body).toHaveProperty("id");
    expect(res.body.email).toBe("ebrenesTest@hco.com");

    // Verifica en BD
    const userInDB = await prisma.user.findUnique({
      where: { email: "ebrenesTest@hco.com" },
    });
    expect(userInDB).toBeTruthy();
    expect(userInDB.name).toBe("Test User");
  });
});
