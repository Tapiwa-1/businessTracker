import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../database.sqlite');

let dbInstance = null;

async function initializeDb() {
  if (dbInstance) return dbInstance;

  dbInstance = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT CHECK(type IN ('income', 'expense')) NOT NULL,
      date TEXT NOT NULL,
      amount REAL NOT NULL,
      source TEXT,
      name TEXT,
      comments TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  console.log('SQLite database initialized');
  return dbInstance;
}

// We need to ensure the DB is initialized before it's used.
// Since we can't export a promise directly as a db object in the same way as mysql2 pool,
// we'll export the initialize function and a getter, or just the promise.
// A common pattern with this library is to await the connection in server.js or just export a wrapper.
// To minimize refactoring impact on controllers (which import 'db'), let's export a proxy or object that controllers can use.
// HOWEVER, sqlite library methods are async.
// Ideally, we start the DB connection at app startup.

// Let's modify the export to be the db promise/instance holder.
// But controllers expect `import db from ...` and then call `db.execute`.
// The `sqlite` library uses `db.run`, `db.get`, `db.all`. `db.execute` is not the standard query method (it's for scripts).
// So we have to refactor controllers anyway.

// Exporting the initializer to be called in server.js
export { initializeDb };

// Also exporting a holder that will be populated.
export const db = {
  get: (...args) => dbInstance.get(...args),
  all: (...args) => dbInstance.all(...args),
  run: (...args) => dbInstance.run(...args),
  exec: (...args) => dbInstance.exec(...args)
};

export default db;
