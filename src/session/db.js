// src/memory/databse.js

import Database from "better-sqlite3";

const db = new Database("./storage/memories.db");
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS conversation (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user TEXT NOT NULL,
    assistant TEXT NOT NULL,
    created_at DATETIME DEFAULT (datetime('now','localtime'))
  )
`);

export default db;
