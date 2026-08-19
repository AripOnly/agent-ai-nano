// src/session/session-store.js

import sql from "./sql.js";
import { randomUUID } from "node:crypto";
import { EVENT } from "../agents/event-type.js";

export function nameFromPrompt(prompt) {
  const words = prompt.trim().split(/\s+/).filter(Boolean).slice(0, 5);
  return words.length > 0 ? words.join(" ") : "session";
}

class SessionStore {
  constructor() {
    this.turns = new Map();
  }

  start(session_id, userInput) {
    this.turns.set(session_id, {
      turn: [
        {
          role: EVENT.USER,
          content: { text: userInput },
        },
      ],
      response: "",
    });
  }

  record(session_id, event) {
    const state = this.turns.get(session_id);
    if (!state) return;

    if (event.role === EVENT.ASSISTANT) {
      state.response += event.content?.text ?? "";
      return;
    }

    state.turn.push(event);
  }

  commit(session_id) {
    const state = this.turns.get(session_id);
    if (!state || state.turn.length === 0) return;

    const exists = sql
      .prepare("SELECT 1 FROM session WHERE id = ?")
      .get(session_id);

    if (!exists) {
      this.turns.delete(session_id);
      throw new Error(`Cannot commit: session ${session_id} does not exist`);
    }

    if (state.response) {
      state.turn.push({
        role: EVENT.ASSISTANT,
        content: {
          text: state.response,
        },
      });
    }

    sql
      .prepare("INSERT INTO turn (parts, session_id) VALUES (?, ?)")
      .run(JSON.stringify(state.turn), session_id);

    sql
      .prepare(
        "UPDATE session SET updated_at = datetime('now','localtime') WHERE id = ?",
      )
      .run(session_id);

    this.turns.delete(session_id);
  }

  getHistory(session_id) {
    const rows = sql
      .prepare("SELECT parts FROM turn WHERE session_id = ? ORDER BY id ASC")
      .all(session_id);

    const history = [];

    for (const row of rows) {
      history.push(...JSON.parse(row.parts));
    }

    return history;
  }

  listSessions() {
    return sql
      .prepare("SELECT * FROM session ORDER BY updated_at DESC, id DESC")
      .all();
  }

  createSession(name = null) {
    const id = randomUUID();
    const finalName = name ?? `session-${id.slice(0, 8)}`;

    sql
      .prepare("INSERT INTO session (id, name) VALUES (?, ?)")
      .run(id, finalName);
    return sql.prepare("SELECT * FROM session WHERE id = ?").get(id);
  }

  getSessionById(id) {
    return sql.prepare("SELECT * FROM session WHERE id = ?").get(id);
  }

  renameSession(id, name) {
    sql
      .prepare("UPDATE session SET name = ?, updated_at = datetime('now','localtime') WHERE id = ?")
      .run(name, id);
  }

  deleteSession(id) {
    sql.prepare("DELETE FROM session WHERE id = ?").run(id);
  }
}

export const sessionStore = new SessionStore();