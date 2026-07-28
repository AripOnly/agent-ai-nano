import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import { googleCleanOutput } from "./google-clean-output.js";
import { EVENT } from "../../../core/event-type.js";

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function* google(request) {
  try {
    const body = {
      model: request.model,
      input: request.input,
      system_instruction: request.instruction,
      tools: request.tools,
      store: false,
      stream: true,
      generation_config: {
        temperature: 0.7,
        thinking_level: "low",
        thinking_summaries: "auto",
      },
    };

    const llmStream = await client.interactions.create(body);

    yield* googleCleanOutput(llmStream);
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
