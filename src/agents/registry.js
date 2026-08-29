// src/agents/registry.js

import { schema } from "../tools/tools.js";

const nano = {
  mode: "primary",
  instruction: "default",
  tools: [
    schema.readTool,
    schema.writeTool,
    schema.shellTool,
    schema.webSearchTool,
    schema.webFetchTool,
  ],
};

const plan = {
  mode: "primary",
  instruction: "plan",
  tools: [schema.readTool, schema.webSearchTool, schema.webFetchTool],
};

const compaction = {
  mode: "subagent",
  instruction: "compaction",
  tools: [],
};

export const agents = {
  nano,
  plan,
  compaction,
};
