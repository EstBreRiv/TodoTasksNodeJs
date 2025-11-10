import { describe, it, expect, beforeEach, vi } from "vitest";

const { mockPrismaInstance, MockPrismaClient } = vi.hoisted(() => {
  const mockInstance = {
    task: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    role: {
      findUnique: vi.fn(),
    },
  };

  class MockPrisma {
    constructor() {
      Object.assign(this, mockInstance);
    }
  }

  return {
    mockPrismaInstance: mockInstance,
    MockPrismaClient: MockPrisma,
  };
});

vi.mock("../generated/prisma/index.js", () => ({
  PrismaClient: MockPrismaClient,
}));

import request from "supertest";
import app from "../app.js";
import jwt from "jsonwebtoken";

describe("POST /tasks", () => {
  let authToken;

  beforeEach(() => {
    vi.clearAllMocks();

    // Asegúrate de que JWT_SECRET esté definido
    process.env.JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

    authToken = jwt.sign({ id: 1, role: "User" }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  });

  it("should create a task successfully", async () => {
    mockPrismaInstance.task.create.mockResolvedValue({
      id: 1,
      title: "Test task",
      description: "desc",
      userId: 1,
      priority: "Medium",
    });

    const res = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        title: "Test task",
        description: "desc",
        dueDate: "2030-01-01",
        priority: "Medium",
      });

    expect(res.status).toBe(201);
    expect(mockPrismaInstance.task.create).toHaveBeenCalled();
  });
});
