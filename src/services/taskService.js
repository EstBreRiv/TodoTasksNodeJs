export class TaskService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findTaskById(id) {
    try
    {
        return await this.prisma.task.findUnique({ where: { id } });
    } catch (error) {
        throw new Error(`Failed to find task with id ${id}: ${error.message}`);
    }
  }

  async createTask(data) {
    try {
        return await this.prisma.task.create({ data });
    } catch (error) {
        throw new Error(`Failed to create task: ${error.message}`);
    }
  }

  async updateTask(id, data) {
    try {
        return await this.prisma.task.update({ where: { id }, data });
    } catch (error) {
        throw new Error(`Failed to update task with id ${id}: ${error.message}`);
    }
  }

  async deleteTask(id) {
    try {
        return await this.prisma.task.delete({ where: { id } });
    } catch (error) {
        throw new Error(`Failed to delete task with id ${id}: ${error.message}`);
    }
  }

  async getAllTasksByUserId(userId) {
    try {
        return await this.prisma.task.findMany({ where: { userId } });
    } catch (error) {
        throw new Error(`Failed to get tasks for user with id ${userId}: ${error.message}`);
    }
  }

  async getTaskByFilter(filter) {
    try {
        return await this.prisma.task.findMany({ where: filter });
    } catch (error) {
        throw new Error(`Failed to get tasks with filter ${JSON.stringify(filter)}: ${error.message}`);
    }
  }
}

export class DatabaseError extends Error {
  constructor(message, originarlError) {
    super(message);
    this.name = 'DatabaseError';
    this.originalError = originarlError; 
  }
}
