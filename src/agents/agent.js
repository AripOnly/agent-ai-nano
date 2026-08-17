// agent.js

import { settings } from "../config/setting.js";
import { agentLoop } from "./agent-loop.js";
import { conversation } from "../session/conversation.js";
import { EVENT } from "./event-type.js";
import { agents } from "./registry.js";
import { instruction } from "../prompts/instruction.js";
import { tokenUsage } from "../usage/token-usage.js";

export async function* agent({ name, prompt }) {
  try {
    const [provider, model] = await settings
      .get("model")
      .then((text) => text.split("/"));

    const messages = conversation.getHistory();
    messages.push({ role: "user", content: { text: prompt } });

    const request = {
      provider,
      model,
      instruction: await instruction(agents[name].instruction),
      input: messages,
      tools: agents[name].tools,
    };

    conversation.start(prompt);

    for await (const event of agentLoop(request)) {
      conversation.record(event);

      if (event.role === EVENT.TOKEN) {
        await tokenUsage.save(event.content);
      }

      yield event;
    }

    conversation.commit();
  } catch (error) {
    yield {
      role: EVENT.ERROR,
      content: { message: error.stack },
    };
  }
}
