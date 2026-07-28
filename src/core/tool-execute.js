// src/agent/execute.js

// src/agent/execute.js

import { tools } from "../tools/tools.js";

export async function toolExecute(toolCall) {
  const name = toolCall.name;
  const arg = JSON.parse(toolCall.arguments);

  switch (name) {
    case "Run":
      return await tools.Run(arg.command);

    case "Read":
      return await tools.Read({
        path: arg.path,
        start_line: arg.start_line,
        end_line: arg.end_line,
      });

    case "Write":
      return await tools.Write({
        path: arg.path,
        content: arg.content,
        mode: arg.mode,
        start_line: arg.start_line,
        end_line: arg.end_line,
      });

    default:
      return {
        success: false,
        error: `Unknown tool: ${name}`,
      };
  }
}
