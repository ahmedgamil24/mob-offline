import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('app.db');

export const initDB = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS todos (
      id TEXT PRIMARY KEY,
      name TEXT,
      is_completed INTEGER DEFAULT 0,
      synced INTEGER DEFAULT 0
    );
  `);
};