// src/agent/agent.js

import { EVENT } from "./event-type.js";
import { llm } from "../llm/llm.js";
import { toolExecute } from "./tool-execute.js";

export async function* baseAgent(request) {
  while (true) {
    let responseText = "";
    let toolCall = null;
    let thoughtSignature = "";

    for await (const event of llm[request.provider](request)) {
      switch (event.type) {
        case EVENT.MODEL_OUTPUT:
          responseText += event.data.text;

          yield {
            type: EVENT.MODEL_OUTPUT,
            data: {
              text: event.data.text,
            },
          };
          break;

        case EVENT.THOUGHT:
          yield {
            type: EVENT.THOUGHT,
            data: {
              text: event.data.text,
            },
          };
          break;

        case EVENT.THOUGHT_SIGNATURE:
          thoughtSignature = event.data.text;
          break;

        case EVENT.FUNCTION_CALL:
          toolCall = {
            ...event.data,
          };

          yield {
            type: EVENT.FUNCTION_CALL,
            data: {
              name: toolCall.name,
              arguments: toolCall.arguments,
            },
          };
          break;

        case EVENT.TOKEN:
          yield {
            type: EVENT.TOKEN,
            data: {
              text: event.data.text,
            },
          };
          break;

        case EVENT.ERROR:
          yield {
            type: EVENT.ERROR,
            data: {
              text: event.data.text,
            },
          };
          break;
      }
    }

    // Simpan thought signature (jika ada)
    if (thoughtSignature) {
      request.input.push({
        type: "thought",
        signature: thoughtSignature,
      });
    }

    // Tidak ada tool lagi, percakapan selesai
    if (!toolCall) {
      break;
    }

    // Jalankan tool
    const result = await toolExecute(toolCall);

    // function_call
    const functionCall = {
      type: "function_call",
      id: toolCall.call_id,
      name: toolCall.name,
      arguments:
        typeof toolCall.arguments === "string"
          ? JSON.parse(toolCall.arguments)
          : toolCall.arguments,
    };

    if (toolCall.signature != null) {
      functionCall.signature = toolCall.signature;
    }

    request.input.push(functionCall);

    // function_result
    const functionResult = {
      type: "function_result",
      call_id: toolCall.call_id,
      name: toolCall.name,
      result: JSON.stringify(result),
    };

    if (toolCall.signature != null) {
      functionResult.signature = toolCall.signature;
    }

    request.input.push(functionResult);
  }
}
