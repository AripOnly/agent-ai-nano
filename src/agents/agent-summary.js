import { config } from "../config/config.js";
import { baseAgent } from "../core/baseAgent.js";
import { conversation } from "../session/conversation.js";
import { promptBuilder } from "../prompt/prompt-builder.js";
import { schema } from "../tools/schema.js";

export async function* AgentSummary(input) {
  const request = {
    provider: config.provider,
    model: config.model,
    intruction: "you are Assistant Summaries",
    input: await promptBuilder[config.provider](input),
    tools: [],
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
