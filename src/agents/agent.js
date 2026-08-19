// agent.js

import { settings } from "../config/setting.js";
import { agentLoop } from "./agent-loop.js";
import { sessionStore } from "../session/session-store.js";
import { EVENT } from "./event-type.js";
import { agents } from "./registry.js";
import { instruction } from "../prompts/instruction.js";
import { tokenUsage } from "../usage/token-usage.js";

export async function* agent({ name, prompt, session_id }) {
  try {
    const [provider, model] = await settings
      .get("model")
      .then((text) => text.split("/"));

    const messages = sessionStore.getHistory(session_id);
    messages.push({ role: "user", content: { text: prompt } });

    const request = {
      provider,
      model,
      instruction: await instruction(agents[name].instruction),
      input: messages,
      tools: agents[name].tools,
    };

    sessionStore.start(session_id, prompt);

    for await (const event of agentLoop(request)) {
      sessionStore.record(session_id, event);

      if (event.role === EVENT.TOKEN) {
        await tokenUsage.save(event.content);
      }

      yield event;
    }

    sessionStore.commit(session_id);
  } catch (error) {
    yield {
      role: EVENT.ERROR,
      content: { message: error.stack },
    };
  }
}
