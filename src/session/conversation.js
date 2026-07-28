// src historie/stm.js

import db from "./db.js";

class Conversation {
  limit = 10;

  save(user, assistant) {
    const stmt = db.prepare(`
      INSERT INTO conversation (user, assistant)
      VALUES (?, ?)
    `);

    return stmt.run(user, assistant);
  }

  get() {
    const stmt = db.prepare(`
      SELECT *
      FROM (
        SELECT *
        FROM conversation
        ORDER BY created_at DESC
        LIMIT ?
      )
      ORDER BY created_at ASC
    `);

    return stmt
      .all(this.limit)
      .map(({ created_at, user, assistant }) =>
        [
          "---",

          `created_at: ${created_at}`,
          `user: ${user}`,
          `assistant: ${assistant}`,
        ].join("\n"),
      )
      .join("\n\n");
  }

  setLimit(limit) {
    this.limit = Math.max(1, Number(limit));
  }
}

export const conversation = new Conversation();
