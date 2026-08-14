// src/memory/databse.js

import Database from "better-sqlite3";

const sql = new Database("./storage/memories.db");
sql.pragma("journal_mode = WAL");
sql.pragma("foreign_keys = ON");

sql.exec(`
  CREATE TABLE IF NOT EXISTS turn (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    parts TEXT NOT NULL,
    created_at DATETIME DEFAULT (datetime('now','localtime'))
  )
`);

export default sql;
