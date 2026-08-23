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

  start(session_id, event, input) {
    this.turns.set(session_id, {
      turn: [
        {
          role: event,
          content: { text: input },
        },
      ],
      response: "",
    });
  }

  record(session_id, event) {
    const state = this.turns.get(session_id);
    if (!state) return;

    if (event.role === EVENT.COMPACTION) return;
    if (event.role === EVENT.TOKEN) return;

    if (event.role === EVENT.ASSISTANT) {
      state.response += event.content?.text ?? "";
      return;
    }

    state.turn.push(event);
  }

  commit(session_id, token = null) {
    const state = this.turns.get(session_id);
    if (!state || state.turn.length === 0) return;

    const exists = sql
      .prepare("SELECT 1 FROM session WHERE id = ?")
      .get(session_id);

    if (!exists) {
      this.turns.delete(session_id);
      throw new Error(`Cannot commit: session ${session_id} does not exist`);
    }

    if (state.response.length > 0) {
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
        "UPDATE session SET updated_at = datetime('now','localtime'), token = COALESCE(?, token) WHERE id = ?",
      )
      .run(token, session_id);

    this.turns.delete(session_id);
  }

  getSummary(session_id) {
    const row = sql
      .prepare("SELECT summary FROM session WHERE id = ?")
      .get(session_id);
    return row?.summary ?? null;
  }

  compact(session_id, summary) {
    this.start(session_id, EVENT.COMPACTION, summary);
    this.commit(session_id);

    sql
      .prepare("UPDATE session SET summary = ? WHERE id = ?")
      .run(summary, session_id);
  }

  getHistory(session_id, parts = false) {
    const rows = sql
      .prepare("SELECT parts FROM turn WHERE session_id = ? ORDER BY id ASC")
      .all(session_id);

    const history = [];

    if (parts) {
      for (const row of rows) {
        history.push(row);
      }

      return history;
    }

    for (const row of rows) {
      history.push(...JSON.parse(row.parts));
    }

    return history;
  }

  historyPruningCheck(sessionId) {
    const rows = this.getHistory(sessionId, true);

    const compactionIndex = rows.findLastIndex((row) => {
      const parts = JSON.parse(row.parts);

      return parts.some((event) => event.role === EVENT.COMPACTION);
    });

    // No compaction exists, return the complete history.
    if (compactionIndex === -1) {
      return rows.flatMap((row) => JSON.parse(row.parts));
    }

    // Keep the last two turns before compaction.
    const start = Math.max(0, compactionIndex - 2);

    // Include the two previous turns and all turns after compaction.
    const selectedRows = rows.slice(start);

    const history = [];

    for (const row of selectedRows) {
      const parts = JSON.parse(row.parts);

      for (const part of parts) {
        // The compaction summary is stored in the database
        // but should not be sent as a normal history event.
        if (part.role === EVENT.COMPACTION) continue;

        history.push(part);
      }
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
      .prepare(
        "UPDATE session SET name = ?, updated_at = datetime('now','localtime') WHERE id = ?",
      )
      .run(name, id);
  }

  deleteSession(id) {
    sql.prepare("DELETE FROM session WHERE id = ?").run(id);
  }
}

export const sessionStore = new SessionStore();
