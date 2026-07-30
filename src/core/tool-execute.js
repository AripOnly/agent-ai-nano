// src/agent/execute.js

import { tools } from "../tools/tools.js";

export async function toolExecute(tool) {
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

    return await tools[name](args);
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}
