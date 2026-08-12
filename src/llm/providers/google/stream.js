// src/provider/google/google-clean-output.js

import { EVENT } from "../../../agents/event-type.js";

function parseArguments(raw) {
  if (typeof raw !== "string" || raw.trim() === "") return {};

  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export async function* stream(llmStream) {
  let currentStepType = null;

  const toolState = {
    signature: "",
    id: null,
    name: null,
    arguments: "",
  };

  for await (const event of llmStream) {
    // console.log(JSON.stringify(event, null, 2));
    switch (event.event_type) {
      case "step.start":
        currentStepType = event.step.type;

        if (currentStepType === "function_call") {
          toolState.id = event.step.id;
          toolState.signature = event.step.signature;
          toolState.name = event.step.name;
          toolState.arguments = "";
        }
        break;

      case "step.delta": {
        const delta = event.delta;

        switch (delta.type) {
          case "text":
            yield {
              type: EVENT.MODEL_OUTPUT,
              data: {
                text: delta.text,
              },
            };
            break;

          case "thought_summary":
            yield {
              type: EVENT.THOUGHT_SUMMARY,
              data: {
                text: delta.content.text,
              },
            };
            break;

          case "thought_signature":
            yield {
              type: EVENT.THOUGHT_SIGNATURE,
              data: {
                text: delta.signature,
              },
            };
            break;

          case "arguments_delta":
            toolState.arguments += delta.arguments;
            break;
        }

        break;
      }

      case "step.stop":
        if (currentStepType === "function_call") {
          yield {
            type: EVENT.FUNCTION_CALL,
            data: {
              signature: toolState.signature,
              call_id: toolState.id,
              name: toolState.name,
              arguments: parseArguments(toolState.arguments),
            },
          };

          toolState.signature = "";
          toolState.id = null;
          toolState.name = null;
          toolState.arguments = "";
        }

        currentStepType = null;
        break;

      case "interaction.completed": {
        const usage = event.interaction?.usage ?? {};

        yield {
          type: EVENT.TOKEN,
          data: {
            inputTokens: usage.total_input_tokens ?? 0,
            outputTokens: usage.total_output_tokens ?? 0,
            totalTokens: usage.total_tokens ?? 0,
          },
        };
        break;
      }
    }
  }
}
