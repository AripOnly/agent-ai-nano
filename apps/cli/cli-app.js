// src/channels/cli.js
import readline from "node:readline/promises";
import { exit, stdin as input, stdout as output } from "node:process";

import { Agent } from "../../src/agents/agent.js";
import { EVENT } from "../../src/core/event-type.js";
const rl = readline.createInterface({
  input,
  output,
});

// ANSI colors
const COLOR = {
  RESET: "\x1b[0m",
  WHITE: "\x1b[37m",
  GREEN: "\x1b[32m",
  YELLOW: "\x1b[33m",
  GRAY: "\x1b[90m",
  RED: "\x1b[31m",
};

function renderCLI(event) {
  if (event.type === EVENT.MODEL_OUTPUT) {
    process.stdout.write(`${COLOR.WHITE}${event.data.text}${COLOR.RESET}`);
  }
  if (event.type === EVENT.THOUGHT) {
    process.stdout.write(`${COLOR.GRAY}${event.data.text}${COLOR.RESET}`);
  }
  if (event.type === EVENT.FUNCTION_CALL) {
    process.stdout.write(
      `\n\n${COLOR.YELLOW}${event.data.name}: ${Object.values(JSON.parse(event.data.arguments))}${COLOR.RESET}\n\n`,
    );
  }
  if (event.type === EVENT.TOKEN) {
    process.stdout.write(
      `\n\n${COLOR.GRAY}Total_tokens: ${event.data.text}${COLOR.RESET}\n\n`,
    );
  }
}

export async function chatCLI() {
  console.log("=== Chatbot Gemini ===");
  console.log("Type 'exit' to quit.\n");

  while (true) {
    const userInput = await rl.question(`\n${COLOR.GREEN}User: ${COLOR.RESET}`);
    const input = userInput.trim().toLowerCase();
    if (input === "exit") {
      break;
    }

    process.stdout.write(`\n${COLOR.WHITE}Gemini: ${COLOR.RESET}`);

    try {
      for await (const event of Agent(userInput)) {
        renderCLI(event);
      }
    } catch (error) {
      console.error(`\n${COLOR.RED}[ERROR]: ${error.stack}${COLOR.RESET}`);
    }

    console.log();
  }

  rl.close();
}
