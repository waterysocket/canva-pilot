import Database, { Database as SQLiteDatabase } from 'better-sqlite3';
import { app } from 'electron';
import path from 'path';
import fs from 'fs';

export class DatabaseManager {
  private static instance: DatabaseManager;
  private db!: SQLiteDatabase;

  private constructor() {
    this.init();
  }

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  private init() {
    const userDataPath = app.getPath('userData');
    const dbPath = path.join(userDataPath, 'canvapilot.sqlite');

    // Ensure the directory exists
    if (!fs.existsSync(userDataPath)) {
      fs.mkdirSync(userDataPath, { recursive: true });
    }

    this.db = new Database(dbPath, {
      // verbose: console.log // uncomment for debugging
    });

    this.db.pragma('journal_mode = WAL');
    this.createTables();
  }

  private createTables() {
    const migrations = `
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        goal TEXT NOT NULL,
        status TEXT NOT NULL,
        context_pack_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS plans (
        id TEXT PRIMARY KEY,
        task_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (task_id) REFERENCES tasks(id)
      );

      CREATE TABLE IF NOT EXISTS plan_steps (
        id TEXT PRIMARY KEY,
        plan_id TEXT NOT NULL,
        action TEXT NOT NULL,
        target TEXT,
        value TEXT,
        status TEXT NOT NULL,
        retry_count INTEGER DEFAULT 0,
        FOREIGN KEY (plan_id) REFERENCES plans(id)
      );

      CREATE TABLE IF NOT EXISTS executions (
        id TEXT PRIMARY KEY,
        task_id TEXT NOT NULL,
        status TEXT NOT NULL,
        started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        ended_at DATETIME,
        log TEXT,
        FOREIGN KEY (task_id) REFERENCES tasks(id)
      );

      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        level TEXT NOT NULL,
        message TEXT NOT NULL,
        meta TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;

    this.db.exec(migrations);
  }

  public getDb(): SQLiteDatabase {
    return this.db;
  }
}
