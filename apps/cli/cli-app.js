// src/channels/cli.js
import readline from "node:readline/promises";
import { exit, stdin as input, stdout as output } from "node:process";

import { agent } from "../../src/agents/agent.js";
import { EVENT } from "../../src/agents/event-type.js";
import {
  conversation,
  nameFromPrompt,
} from "../../src/session/conversation.js";

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
  if (event.role === EVENT.ASSISTANT) {
    process.stdout.write(`\n${COLOR.WHITE}${event.content.text}${COLOR.RESET}`);
  }
  if (event.role === EVENT.REASONING_SUMMARY) {
    process.stdout.write(
      `\n${COLOR.GRAY}${event.content.summary}${COLOR.RESET}`,
    );
  }
  if (event.role === EVENT.TOOL_CALL) {
    process.stdout.write(
      `\n${COLOR.YELLOW}${event.content.name}: ${Object.values(event.content.arguments)}${COLOR.RESET}`,
    );
  }
  if (event.role === EVENT.TOKEN) {
    process.stdout.write(
      `\n${COLOR.GRAY}Tokens: ${JSON.stringify(event.content.total_tokens, null, 2)}${COLOR.RESET}\n`,
    );
  }
  if (event.role === EVENT.ERROR) {
    process.stdout.write(
      `\n${COLOR.RED}[ERROR]: ${event.content.message}${COLOR.RESET}\n`,
    );
  }
}

async function chatCLI() {
  console.log("=== Chatbot Gemini ===");
  console.log("Type 'exit' to quit.\n");

  let session = null;

  while (true) {
    console.log(`${COLOR.WHITE}====== User ====== ${COLOR.RESET}`);
    const userInput = await rl.question(`\n${COLOR.GREEN}User: ${COLOR.RESET}`);
    const input = userInput.trim().toLowerCase();
    if (input === "exit") {
      break;
    }

    console.log(`\n${COLOR.WHITE}====== Nano ====== ${COLOR.RESET}`);

    try {
      if (!session) {
        session = conversation.createSession(nameFromPrompt(userInput));
      }

      for await (const event of agent({
        name: "nano",
        prompt: userInput,
        session_id: session.id,
      })) {
        renderCLI(event);
      }
    } catch (error) {
      console.error(`\n${COLOR.RED}[ERROR]: ${error.stack}${COLOR.RESET}`);
    }

    console.log();
  }

  rl.close();
}

await chatCLI();
