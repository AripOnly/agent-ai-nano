// src/agents/compaction.js

import { llm } from "../llm/llm.js";
import { instruction } from "../prompts/instruction.js";
import { EVENT } from "./event-type.js";
import { sessionStore } from "../session/session-store.js";
import models from "../llm/providers/google/models.js";
import { agents } from "./registry.js";

const COMPACTION_RATIO = 0.01;
const KEEP_TURNS = 2;

export function compactionCheck({ model, token = null }) {
  const modelLimit = models.find((m) => m.id === model)?.context;

  if (!modelLimit) {
    return false;
  }

  return (token ?? 0) > modelLimit * COMPACTION_RATIO;
}

export async function* compaction({ session_id, provider, model }) {
  const rows = sessionStore.getHistory(session_id, true);

  // There is nothing to compact if there are not enough turns.
  if (rows.length <= KEEP_TURNS) {
    return null;
  }

  const compactRows = rows.slice(0, -KEEP_TURNS);
  const full = compactRows.flatMap((row) => JSON.parse(row.parts));
  const messages = full.filter((item) => item?.role !== EVENT.COMPACTION);
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
