import { DatabaseManager } from '../DatabaseManager.js';
export class TaskRepository {
    dbManager;
    constructor() {
        this.dbManager = DatabaseManager.getInstance();
    }
    createTask(task) {
        const stmt = this.dbManager.getDb().prepare(`
      INSERT INTO tasks (id, goal, status, context_pack_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
        stmt.run(task.id, task.goal, task.status, task.contextPackId || null, task.createdAt.toISOString(), task.updatedAt.toISOString());
    }
    getTaskById(id) {
        const stmt = this.dbManager.getDb().prepare('SELECT * FROM tasks WHERE id = ?');
        const row = stmt.get(id);
        if (!row)
            return null;
        return {
            id: row.id,
            goal: row.goal,
            status: row.status,
            contextPackId: row.context_pack_id,
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at)
        };
    }
    updateTaskStatus(id, status) {
        const stmt = this.dbManager.getDb().prepare(`
      UPDATE tasks 
      SET status = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);
        stmt.run(status, id);
    }
}
