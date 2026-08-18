// src/session/sql.js

import Database from "better-sqlite3";

const sql = new Database("./storage/memories.db");
sql.pragma("journal_mode = WAL");
sql.pragma("foreign_keys = ON");

sql.exec(`
  CREATE TABLE IF NOT EXISTS session (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT (datetime('now','localtime')),
    updated_at DATETIME DEFAULT (datetime('now','localtime'))
  );
`);

sql.exec(`
  CREATE TABLE IF NOT EXISTS turn (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    parts TEXT NOT NULL,
    session_id TEXT REFERENCES session(id) ON DELETE CASCADE,
    created_at DATETIME DEFAULT (datetime('now','localtime'))
  );
`);

sql.exec(`
  CREATE INDEX IF NOT EXISTS idx_turn_session ON turn(session_id);
`);

export default sql;
