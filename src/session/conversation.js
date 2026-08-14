// src/session/conversation.js

import sql from "./sql.js";
import { EVENT } from "../agents/event-type.js";

class Conversation {
  constructor() {
    this.turn = null;
    this.response = "";
  }

  start(userInput) {
    this.turn = [
      {
        role: EVENT.USER,
        content: { text: userInput },
      },
    ];

    this.response = "";
  }

  record(event) {
    if (!this.turn) {
      this.turn = [];
    }

    if (event.role === EVENT.ASSISTANT) {
      this.response += event.content?.text ?? "";
      return;
    }

    this.turn.push(event);
  }

  commit() {
    if (!this.turn || this.turn.length === 0) return;

    // Add the complete assistant response as one event.
    if (this.response) {
      this.turn.push({
        role: EVENT.ASSISTANT,
        content: {
          text: this.response,
        },
      });
    }

    sql
      .prepare("INSERT INTO turn (parts) VALUES (?)")
      .run(JSON.stringify(this.turn));

    this.turn = null;
    this.response = "";
  }

  getHistory() {
    const rows = sql.prepare("SELECT parts FROM turn ORDER BY id ASC").all();

    const history = [];

    for (const row of rows) {
      history.push(...JSON.parse(row.parts));
    }

    return history;
  }
}

export const conversation = new Conversation();
