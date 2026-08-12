// src/session/conversation.js

import db from "./db.js";
import { EVENT } from "../agents/event-type.js";

class Conversation {
  constructor() {
    this.turn = null;
  }

  start(userInput) {
    this.turn = [{ role: "user", type: "text", text: userInput }];
  }

  record(event) {
    if (!this.turn) {
      this.turn = [];
    }

    switch (event.type) {
      case EVENT.MODEL_OUTPUT:
        this.turn.push({
          role: "assistant",
          type: "text",
          text: event.data.text,
        });
        break;

      case EVENT.THOUGHT_SUMMARY:
        this.turn.push({
          role: "assistant",
          type: "reasoning",
          text: event.data.text,
        });
        break;

      case EVENT.THOUGHT_SIGNATURE:
        for (let i = this.turn.length - 1; i >= 0; i--) {
          if (this.turn[i].type === "reasoning") {
            this.turn[i].signature = event.data.text;
            break;
          }
        }
        break;

      case EVENT.FUNCTION_CALL:
        this.turn.push({
          role: "assistant",
          type: "tool_call",
          call_id: event.data.call_id,
          name: event.data.name,
          arguments: event.data.arguments,
        });
        break;

      case EVENT.FUNCTION_RESULT:
        this.turn.push({
          role: "tool",
          type: "tool_result",
          call_id: event.data.call_id,
          name: event.data.name,
          result: event.data.result,
          signature: event.data.signature,
        });
        break;

      case EVENT.TOKEN:
        this.turn.push({
          role: "system",
          type: "usage",
          inputTokens: event.data.inputTokens,
          outputTokens: event.data.outputTokens,
          totalTokens: event.data.totalTokens,
        });
        break;

      case EVENT.ERROR:
        this.turn.push({
          role: "system",
          type: "error",
          text: event.data.text,
        });
        break;
    }
  }

  commit() {
    if (!this.turn || this.turn.length === 0) return;

    db.prepare("INSERT INTO turn (parts) VALUES (?)").run(
      JSON.stringify(this.turn),
    );

    this.turn = null;
  }

  getHistory() {
    const rows = db.prepare("SELECT parts FROM turn ORDER BY id ASC").all();

    const history = [];

    for (const row of rows) {
      history.push(...JSON.parse(row.parts));
    }

    return history;
  }
}

export const conversation = new Conversation();
