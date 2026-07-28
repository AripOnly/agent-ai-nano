// src/agent/context.js

import { conversation } from "../session/conversation.js";
import { timestamp } from "../utils/time.js";

async function buildContext(input) {
  const promptData = `
[Recent Conversation]
${await conversation.get()}

[Current Message]
timestamp: ${timestamp()}
user: ${input} 
`;

  return promptData;
}

const google = async (input) => {
  return [
    {
      type: "user_input",
      content: [{ type: "text", text: await buildContext(input) }],
    },
  ];
};

export const promptBuilder = {
  google,
};
