// workflow.js

import { config } from "../config/config.js";
import { baseAgent } from "../core/baseAgent.js";
import { conversation } from "../session/conversation.js";
import { promptBuilder } from "../prompt/prompt-builder.js";
import { tools } from "../tools/tools.js";

export async function* AgentReAct(input) {
  const request = {
    provider: config.provider,
    model: config.model,
    intruction: "you are Assistant AI Agent Otonom.",
    input: await promptBuilder[config.provider](input),
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
