// workflow.js

import { settings } from "../config/setting.js";
import { agentLoop } from "./agent-loop.js";
import { conversation } from "../session/conversation.js";
import { tools } from "../tools/tools.js";
import { system } from "../prompts/system.js";
import { EVENT } from "./event-type.js";

export async function* Agent(input) {
  try {
    const { model, provider } = await settings.getAll();

    const messages = conversation.getHistory();
    messages.push({ role: "user", content: { text: input } });

    const request = {
      provider: provider,
      model: model,
      instruction: await system(),
      input: messages,
      tools: [
        tools.schema.Read,
        tools.schema.Write,
        tools.schema.Run,
        tools.schema.WebScrape,
        tools.schema.WebSearch,
      ],
    };

    conversation.start(input);

    for await (const event of agentLoop(request)) {
      conversation.record(event);

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
