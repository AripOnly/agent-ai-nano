// workflow.js

import { settings } from "../config/setting.js";
import { agentLoop } from "./agent-loop.js";
import { conversation } from "../session/conversation.js";
import { tools } from "../tools/tools.js";

export async function* Agent(input) {
  const { model, provider } = await settings.getAll();
  const system = `
You are an autonomous AI assistant agent named Nano.`;

  const messages = conversation.getHistory();
  messages.push({ role: "user", text: input });

  const request = {
    provider: provider,
    model: model,
    instruction: system,
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
}