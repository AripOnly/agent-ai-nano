import { tools } from "../tools/tools.js";

const nano = {
  mode: "primary",
  instruction: "default",
  tools: [
    tools.schema.Read,
    tools.schema.Write,
    tools.schema.Run,
    tools.schema.WebScrape,
    tools.schema.WebSearch,
  ],
};

const plan = {
  mode: "primary",
  instruction: "plan",
  tools: [tools.schema.Read, tools.schema.WebScrape, tools.schema.WebSearch],
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
