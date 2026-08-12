import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import { stream as streamEvents } from "./stream.js";
import { EVENT } from "../../../agents/event-type.js";
import { settings } from "../../../config/setting.js";

const client = new GoogleGenAI({
  apiKey: await settings.get("apiKey"),
});

function toGemini(part) {
  const type = part.type ?? "text";

  if (type === "usage" || type === "error") return null;

  if (type === "reasoning") {
    const thought = {
      type: "thought",
      signature: part.signature,
    };

    if (part.text) {
      thought.summary = part.text;
    }

    return thought;
  }

  if (type === "tool_call") {
    const functionCall = {
      type: "function_call",
      id: part.call_id,
      name: part.name,
      arguments: part.arguments,
    };

    if (part.signature != null) {
      functionCall.signature = part.signature;
    }

    return functionCall;
  }

  if (type === "tool_result") {
    const functionResult = {
      type: "function_result",
      call_id: part.call_id,
      name: part.name,
      result:
        typeof part.result === "string"
          ? part.result
          : JSON.stringify(part.result),
    };

    if (part.signature != null) {
      functionResult.signature = part.signature;
    }

    return functionResult;
  }

  if (part.role === "assistant") {
    return {
      type: "model_output",
      content: [{ type: "text", text: part.text }],
    };
  }

  return {
    type: "user_input",
    content: [{ type: "text", text: part.text }],
  };
}

export async function* stream(request) {
  try {
    const input = request.input
      .map(toGemini)
      .filter((part) => part != null);

    const body = {
      model: request.model,
      input,
      system_instruction: request.instruction,
      tools: request.tools,
      store: false,
      stream: true,
      generation_config: {
        temperature: 1.0,
        thinking_level: "low",
        thinking_summaries: "auto",
      },
    };

    const llmStream = await client.interactions.create(body);

    yield* streamEvents(llmStream);
  } catch (err) {
    let message = err.message;

    if (err.body) {
      try {
        const data = err.body
          .split("\n")
          .find((line) => line.startsWith("data: "))
          ?.slice(6);

        if (data) {
          message = JSON.parse(data).error.message;
        }
      } catch {
        err.message;
      }
    }

    yield {
      type: EVENT.ERROR,
      data: {
        text: `error: ${err}\nmessage: ${message}`,
      },
    };
  }
}

export function feed({ thoughtSignature, toolCall, toolResult }) {
  const parts = [];

  if (thoughtSignature) {
    parts.push({
      role: "assistant",
      type: "reasoning",
      signature: thoughtSignature,
    });
  }

  if (!toolCall) {
    return parts;
  }

  const functionCall = {
    role: "assistant",
    type: "tool_call",
    call_id: toolCall.call_id,
    name: toolCall.name,
    arguments: toolCall.arguments,
  };

  if (toolCall.signature != null) {
    functionCall.signature = toolCall.signature;
  }

  parts.push(functionCall);

  const functionResult = {
    role: "tool",
    type: "tool_result",
    call_id: toolCall.call_id,
    name: toolCall.name,
    result: toolResult,
  };

  if (toolCall.signature != null) {
    functionResult.signature = toolCall.signature;
  }

  parts.push(functionResult);

  return parts;
}