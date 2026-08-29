// agent.js

import { settings } from "../config/setting.js";
import { agentLoop } from "./agent-loop.js";
import { sessionStore } from "../session/session-store.js";
import { EVENT } from "./event-type.js";
import { agents } from "./registry.js";
import { createInstruction } from "../prompts/createInstruction.js";
import { compaction, checkCompaction } from "./compaction.js";

export async function* agent({ name, prompt, session_id }) {
  try {
    const [provider, model] = (await settings.get("model")).split("/");
    const session = sessionStore.getSessionById(session_id);

    if (!session) {
      throw new Error(`Session ${session_id} not found`);
    }

    let token = session.token ?? 0;
    let { summary } = sessionStore.getSessionById(session_id) ?? "";
    let history = sessionStore.getHistory(session_id);
    let resultCompaction = "";

    if (await checkCompaction({ model, token })) {
      for await (const event of compaction({
        history,
        session_id,
        provider,
        model,
      })) {
        if (event.role === EVENT.ASSISTANT) {
          resultCompaction += event.content.text;
          yield {
            role: EVENT.COMPACTION,
            content: { text: event.content.text },
          };
        }

        if (event.role === EVENT.ERROR) {
          yield event;
        }
      }
    }

    history.push({ role: EVENT.USER, content: { text: prompt } });

    if (resultCompaction) {
      summary = resultCompaction.trim();
      history.push({ role: EVENT.COMPACTION, content: resultCompaction });
    }

    const instruction = await createInstruction(agents[name].instruction, {
      summary,
    });

    let input = sessionStore.pruneHistory(history);

    const request = {
      provider,
      model,
      instruction,
      input,
      tools: agents[name].tools,
      session_id,
    };

    sessionStore.start(session_id, EVENT.USER, prompt);
    for await (const event of agentLoop(request)) {
      sessionStore.record(session_id, event);

      if (event.role === EVENT.TOKEN) {
        token = event.content.total_tokens;
      }

      yield event;
    }

    sessionStore.commit(session_id, token);
  } catch (error) {
    yield {
      role: EVENT.ERROR,
      content: { message: error.stack },
    };
  }
}
