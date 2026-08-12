// src/agent/agent.js

import { EVENT } from "./event-type.js";
import { llm } from "../llm/llm.js";
import { toolExecute } from "./tool-execute.js";

export async function* agentLoop(request) {
  const provider = llm[request.provider];

  if (!provider) {
    throw new Error(`Unknown provider: ${request.provider}`);
  }

  while (true) {
    let toolCall = null;
    let thoughtSignature = "";

    for await (const event of provider.stream(request)) {
      switch (event.type) {
        case EVENT.THOUGHT_SIGNATURE:
          thoughtSignature = event.data.text;
          break;

        case EVENT.FUNCTION_CALL:
          toolCall = { ...event.data };
          break;
      }

      yield event;
    }

    if (!toolCall) break;

    const result = await toolExecute(toolCall);

    yield {
      type: EVENT.FUNCTION_RESULT,
      data: {
        call_id: toolCall.call_id,
        name: toolCall.name,
        result,
        ...(toolCall.signature != null
          ? { signature: toolCall.signature }
          : {}),
      },
    };

    request.input.push(
      ...provider.feed({ thoughtSignature, toolCall, toolResult: result }),
    );
  }
}