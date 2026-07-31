// workflow.js

import { settings } from "../config/setting.js";
import { baseAgent } from "../core/base-agent.js";
import { conversation } from "../session/conversation.js";
import { promptBuilder } from "../prompt/prompt-builder.js";
import { tools } from "../tools/tools.js";

export async function* Agent(input) {
  const { model, provider } = await settings.getAll();
  const system = `
You are an autonomous AI assistant agent named Nano.`;

  const request = {
    provider: provider,
    model: model,
    instruction: system,
    input: await promptBuilder[provider](input),
    tools: [
      tools.schema.Read,
      tools.schema.Write,
      tools.schema.Run,
      tools.schema.WebScrape,
      tools.schema.WebSearch,
    ],
  };

  let modelOutput = "";

  for await (const event of baseAgent(request)) {
    if (event.type === "model_output") {
      modelOutput += event.data.text;
    }

    yield event;
  }

  conversation.save(input, modelOutput);
}
