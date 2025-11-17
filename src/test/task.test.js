import { describe, it, expect, beforeEach, vi } from "vitest";
import { TaskService } from "../services/taskService.js";

describe("TaskService", () => {
  let taskService;
  let mockPrisma;

  beforeEach(() => {
    mockPrisma = {
      task: {
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        findMany: vi.fn(),
      },
    };
    taskService = new TaskService(mockPrisma);
  });

  describe("findTaskById", () => {
    it("should return a task when found", async () => {
      const mockTask = { id: 1, title: "Test Task", userId: 1 };
      mockPrisma.task.findUnique.mockResolvedValue(mockTask);

      const result = await taskService.findTaskById(1);

      expect(result).toEqual(mockTask);
      expect(mockPrisma.task.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("should return null when task not found", async () => {
      mockPrisma.task.findUnique.mockResolvedValue(null);

      const result = await taskService.findTaskById(999);

      expect(result).toBeNull();
    });

    it("should throw error on database failure", async () => {
      mockPrisma.task.findUnique.mockRejectedValue(new Error("Connection lost"));

      // ✅ Usa string, no variable
      await expect(taskService.findTaskById(1)).rejects.toThrow(
        "Failed to find task with id 1"
      );
    });
  });

  describe("createTask", () => {
    it("should create a new task successfully", async () => {
      const taskData = { title: "New Task", description: "Description" };
      const mockCreatedTask = { id: 1, ...taskData, userId: 1 };
      
      mockPrisma.task.create.mockResolvedValue(mockCreatedTask);

      // ✅ Nombre correcto: createTask
      const result = await taskService.createTask(taskData);

      expect(result).toEqual(mockCreatedTask);
      expect(mockPrisma.task.create).toHaveBeenCalledWith({
        data: taskData,
      });
    });

    it("should throw error on creation failure", async () => {
      mockPrisma.task.create.mockRejectedValue(new Error("DB Error"));

      await expect(
        taskService.createTask({ title: "Test" })
      ).rejects.toThrow("DB Error");
    });
  });

  describe("updateTask", () => {
    it("should update an existing task", async () => {
      const updateData = { title: "Updated Title" };
      const mockUpdatedTask = { id: 1, title: "Updated Title", userId: 1 };
      
      mockPrisma.task.update.mockResolvedValue(mockUpdatedTask);

      // ✅ Nombre correcto: updateTask
      const result = await taskService.updateTask(1, updateData);

      expect(result).toEqual(mockUpdatedTask);
      expect(mockPrisma.task.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateData,
      });
    });

    it("should throw error on update failure", async () => {
      mockPrisma.task.update.mockRejectedValue(new Error("Not found"));

      await expect(
        taskService.updateTask(999, { title: "Test" })
      ).rejects.toThrow("Not found");
    });
  });

  describe("deleteTask", () => {
    it("should delete a task successfully", async () => {
      const mockDeletedTask = { id: 1, title: "Deleted Task" };
      mockPrisma.task.delete.mockResolvedValue(mockDeletedTask);

      // ✅ Nombre correcto: deleteTask
      const result = await taskService.deleteTask(1);

      expect(result).toEqual(mockDeletedTask);
      expect(mockPrisma.task.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("should throw error on delete failure", async () => {
      mockPrisma.task.delete.mockRejectedValue(new Error("Not found"));

      await expect(taskService.deleteTask(999)).rejects.toThrow("Not found");
    });
  });

  describe("getAllTasksByUserId", () => {
    it("should return all tasks for a user", async () => {
      const mockTasks = [
        { id: 1, title: "Task 1", userId: 1 },
        { id: 2, title: "Task 2", userId: 1 },
      ];
      mockPrisma.task.findMany.mockResolvedValue(mockTasks);

      // ✅ Nombre correcto: getAllTasksByUserId
      const result = await taskService.getAllTasksByUserId(1);

      expect(result).toEqual(mockTasks);
      expect(result).toHaveLength(2);
      expect(mockPrisma.task.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
      });
    });

    it("should return empty array when user has no tasks", async () => {
      mockPrisma.task.findMany.mockResolvedValue([]);

      const result = await taskService.getAllTasksByUserId(999);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it("should throw error on failure", async () => {
      mockPrisma.task.findMany.mockRejectedValue(new Error("DB Error"));

      await expect(
        taskService.getAllTasksByUserId(1)
      ).rejects.toThrow("DB Error");
    });
  });

  describe("getTaskByFilter", () => {
    it("should return tasks matching the filter", async () => {
      const filter = { status: "completed", priority: "high" };
      const mockTasks = [
        { id: 1, title: "Task 1", status: "completed", priority: "high" },
      ];
      mockPrisma.task.findMany.mockResolvedValue(mockTasks);

      // ✅ Nombre correcto: getTaskByFilter
      const result = await taskService.getTaskByFilter(filter);

      expect(result).toEqual(mockTasks);
      expect(mockPrisma.task.findMany).toHaveBeenCalledWith({
        where: filter,
      });
    });

    it("should handle empty filter results", async () => {
      mockPrisma.task.findMany.mockResolvedValue([]);

      const result = await taskService.getTaskByFilter({ status: "archived" });

      expect(result).toEqual([]);
    });
  });
});