import { DatabaseManager } from '../DatabaseManager.js';
import { Task } from '../../types/index.js';

export class TaskRepository {
  private dbManager: DatabaseManager;

  constructor() {
    this.dbManager = DatabaseManager.getInstance();
  }

  public createTask(task: Task): void {
    const stmt = this.dbManager.getDb().prepare(`
      INSERT INTO tasks (id, goal, status, context_pack_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      task.id,
      task.goal,
      task.status,
      task.contextPackId || null,
      task.createdAt.toISOString(),
      task.updatedAt.toISOString()
    );
  }

  public getTaskById(id: string): Task | null {
    const stmt = this.dbManager.getDb().prepare('SELECT * FROM tasks WHERE id = ?');
    const row = stmt.get(id) as any;
    
    if (!row) return null;
    
    return {
      id: row.id,
      goal: row.goal,
      status: row.status,
      contextPackId: row.context_pack_id,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  public updateTaskStatus(id: string, status: string): void {
    const stmt = this.dbManager.getDb().prepare(`
      UPDATE tasks 
      SET status = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);
    stmt.run(status, id);
  }

  public getAllTasks(): any[] {
    const stmt = this.dbManager.getDb().prepare('SELECT * FROM tasks ORDER BY created_at DESC');
    const rows = stmt.all() as any[];
    
    return rows.map(row => ({
      id: row.id,
      goal: row.goal,
      status: row.status,
      contextPackId: row.context_pack_id,
      startedAt: new Date(row.created_at).getTime(),
      durationMs: row.updated_at ? new Date(row.updated_at).getTime() - new Date(row.created_at).getTime() : 0,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    }));
  }
}
