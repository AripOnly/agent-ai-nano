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

// src/agent/execute.js

// src/agent/tool-execute.js

// import { tools } from "../tools/tools.js";

// /**
//  * Execute tool call.
//  *
//  * @param {Object} toolCall
//  * @returns {Promise<Object>}
//  */
// export async function toolExecute(toolCall) {
//   // ==========================
//   // Validasi toolCall
//   // ==========================
//   if (!toolCall || typeof toolCall !== "object") {
//     return {
//       success: false,
//       error: "Invalid tool call.",
//     };
//   }

//   const { name, arguments: rawArguments } = toolCall;

//   if (typeof name !== "string" || name.trim() === "") {
//     return {
//       success: false,
//       error: "Tool name is required.",
//     };
//   }

//   // ==========================
//   // Cari tool
//   // ==========================
//   const tool = tools[name];

//   if (typeof tool !== "function") {
//     return {
//       success: false,
//       error: `Unknown tool: ${name}`,
//     };
//   }

//   // ==========================
//   // Parse arguments
//   // ==========================
//   let args = {};

//   try {
//     if (typeof rawArguments === "string") {
//       args = JSON.parse(rawArguments);
//     } else if (
//       rawArguments &&
//       typeof rawArguments === "object" &&
//       !Array.isArray(rawArguments)
//     ) {
//       args = rawArguments;
//     } else {
//       args = {};
//     }
//   } catch {
//     return {
//       success: false,
//       error: `Invalid JSON arguments for tool "${name}".`,
//     };
//   }

//   // ==========================
//   // Execute
//   // ==========================
//   try {
//     return await tool(args);
//   } catch (err) {
//     return {
//       success: false,
//       error: err?.message ?? "Tool execution failed.",
//     };
//   }
// }
