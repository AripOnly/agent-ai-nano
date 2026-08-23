// src/agent/agent.js

import { EVENT } from "./event-type.js";
import { llm } from "../llm/llm.js";
import { toolExecute } from "./tool-execute.js";
import { toStr } from "../utils/tostr.js";

export async function* agentLoop(request) {
  const provider = llm[request.provider];

  if (!provider) {
    throw new Error(`Unknown provider: ${request.provider}`);
  }

  while (true) {
    let toolCall = [];
    let reasoningSignature = "";
    let assistantText = "";
    let token = 0;

    for await (const event of provider.request(request)) {
      switch (event.role) {
        case EVENT.ASSISTANT:
          assistantText += event.content.text;
          break;

        case EVENT.REASONING_SIGNATURE:
          reasoningSignature = event.content.signature;
          break;

        case EVENT.TOOL_CALL:
          toolCall.push({ ...event.content });
          break;

        case EVENT.TOKEN:
          token = event.content.total_tokens;
          break;
      }

      yield event;
    }

    if (toolCall.length === 0) break;

    if (assistantText) {
      request.input.push({
        role: EVENT.ASSISTANT,
        content: { text: assistantText },
      });
    }

    const results = await Promise.all(toolCall.map((tc) => toolExecute(tc)));

    for (let i = 0; i < toolCall.length; i++) {
      yield {
        role: EVENT.TOOL_RESULT,
        content: {
          call_id: toolCall[i].call_id,
          name: toolCall[i].name,
          result: results[i],
          ...(toolCall[i].signature != null
            ? { signature: toolCall[i].signature }
            : {}),
        },
      };
    }

    request.input.push(
      ...provider.feed({
        reasoningSignature,
        toolCall,
        toolResult: results.map(toStr),
      }),
    );
  }
}
