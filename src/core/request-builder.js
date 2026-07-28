// src/agent/request.js

import { schema } from "../tools/schema.js";
import { config } from "../config/config.js";

export const requestBuilder = {
  // model: "gemma-4-31b-it",
  model: config.model,
  instructions: "you are adalah Assistant AI Agent Otonom.",
  input: [],
  tools: [],
};
