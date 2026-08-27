// src/agent/execute.js

import { tools } from "../tools/tools.js";

export async function toolExecute(tool, context = {}) {
  const { name, arguments: rawArgument } = tool;

  if (!(name in tools)) {
    return {
      success: false,
      error: `Tool "${name}" not found.`,
    };
  }

  try {
    const args =
      typeof rawArgument === "string" ? JSON.parse(rawArgument) : rawArgument;

    return await tools[name](args, context);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
