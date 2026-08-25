// src/agents/compaction.js

import { llm } from "../llm/llm.js";
import { instruction } from "../prompts/instruction.js";
import { EVENT } from "./event-type.js";
import { sessionStore } from "../session/session-store.js";
import models from "../llm/providers/google/models.js";
import { agents } from "./registry.js";

const COMPACTION_RATIO = 0.02;
const KEEP_TURNS = 2;

export function checkCompaction({ model, token = null }) {
  const modelLimit = models.find((m) => m.id === model)?.context;

  if (!modelLimit) {
    return false;
  }

  return (token ?? 0) > modelLimit * COMPACTION_RATIO;
}

export async function* compaction({ history, session_id, provider, model }) {
  // There is nothing to compact if there are not enough turns.
  if (history.length <= KEEP_TURNS) {
    return null;
  }

  let userIndexes = [];

  let lastCompactionIndex = history.findLastIndex(
    (event) => event.role === EVENT.COMPACTION,
  );

  if (lastCompactionIndex === -1) {
    lastCompactionIndex = history.length;
  }

  for (let i = 0; i < lastCompactionIndex; i++) {
    if (history[i]?.role === EVENT.USER) {
      userIndexes.push(i);
    }
  }

  const keepUserIndexes = userIndexes.slice(-KEEP_TURNS);

  if (keepUserIndexes.length < KEEP_TURNS) {
    return null;
  }

  const compactHistory = history.slice(0, keepUserIndexes[0]);

  const messages = compactHistory.filter(
    (item) => item?.role !== EVENT.COMPACTION,
  );

  const oldSummary = sessionStore.getSummary(session_id);
  const compaction = agents["compaction"];
  const request = {
    provider,
    model,
    instruction: await instruction(compaction.instruction),
    input: [
      ...(oldSummary
        ? [
            {
              role: EVENT.USER,
              content: {
                text: `Ringkasan sebelumnya:\n${oldSummary}`,
              },
            },
          ]
        : []),

      ...messages,

      {
        role: EVENT.USER,
        content: {
          text: "Buat ringkasan percakapan di atas sekarang.",
        },
      },
    ],

    tools: compaction.tools,
  };

  let summary = "";
  for await (const event of llm[provider].request(request)) {
    if (event.role === EVENT.ASSISTANT) {
      summary += event.content?.text ?? "";
    }

    yield event;
  }

  summary = summary.trim();

  if (!summary) {
    throw new Error("Compaction returned an empty summary");
  }

  sessionStore.compact(session_id, summary);
}
