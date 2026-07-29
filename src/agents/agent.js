// workflow.js

import { settings } from "../config/setting.js";
import { baseAgent } from "../core/base-agent.js";
import { conversation } from "../session/conversation.js";
import { promptBuilder } from "../prompt/prompt-builder.js";
import { tools } from "../tools/tools.js";

export async function* Agent(input) {
  const { model, provider } = await settings.getAll();

  const request = {
    provider: provider,
    model: model,
    instruction: `You are an Autonomous Assistant AI Agent. You are using model ${model}.`,
    input: await promptBuilder[provider](input),
    tools: [tools.schema.read, tools.schema.write, tools.schema.run],
  };

  let modelOutput = "";

  for await (const event of baseAgent(request)) {
    if (event.type === "model_output") {
      modelOutput += event.data.text;
    }

    yield event;
  }

  // conversation.save(input, modelOutput);
}
