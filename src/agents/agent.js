// agent.js

import { settings } from "../config/setting.js";
import { agentLoop } from "./agent-loop.js";
import { sessionStore } from "../session/session-store.js";
import { EVENT } from "./event-type.js";
import { agents } from "./registry.js";
import { instruction } from "../prompts/instruction.js";
import { compaction, compactionCheck } from "./compaction.js";

export async function* agent({ name, prompt, session_id }) {
  try {
    const [provider, model] = (await settings.get("model")).split("/");

    // get session
    const session = sessionStore.getSessionById(session_id);
    if (!session) {
      throw new Error(`Session ${session_id} not found`);
    }
    let { token } = session;

    // compaction check
    if (compactionCheck({ model, token })) {
      for await (const event of compaction({
        session_id,
        provider,
        model,
      })) {
        if (event.role === EVENT.ASSISTANT) {
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

    let messages = sessionStore.historyPruningCheck(session_id);
    messages.push({ role: EVENT.USER, content: { text: prompt } });

    const { summary } = sessionStore.getSessionById(session_id);

    const baseIns = await instruction(agents[name].instruction, { summary });
    const request = {
      provider,
      model,
      instruction: baseIns,
      input: messages,
      tools: agents[name].tools,
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
