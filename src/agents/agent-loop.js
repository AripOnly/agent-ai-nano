// src/agent/agent.js

import { EVENT } from "./event-type.js";
import { llm } from "../llm/llm.js";
import { toolExecute } from "./tool-execute.js";
import { toStr } from "../utils/tostr.js";

export async function* agentLoop(request) {
  // console.log(request);
  // return;
  const provider = llm[request.provider];

  if (!provider) {
    throw new Error(`Unknown provider: ${request.provider}`);
  }

  while (true) {
    let toolCall = null;
    let reasoningSignature = "";

    for await (const event of provider.request(request)) {
      switch (event.role) {
        case EVENT.REASONING_SIGNATURE:
          reasoningSignature = event.content.signature;
          break;

        case EVENT.TOOL_CALL:
          toolCall = { ...event.content };
          break;
      }

      yield event;
    }

    if (!toolCall) break;

    const result = await toolExecute(toolCall);

    yield {
      role: EVENT.TOOL_RESULT,
      content: {
        call_id: toolCall.call_id,
        name: toolCall.name,
        result,
        ...(toolCall.signature != null
          ? { signature: toolCall.signature }
          : {}),
      },
    };

    request.input.push(
      ...provider.feed({
        reasoningSignature,
        toolCall,
        toolResult: toStr(result),
      }),
    );
  }
}
