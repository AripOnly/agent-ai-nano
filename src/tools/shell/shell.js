// src/tools/shell/shell.js

import { analyzeCommand } from "./analyze.js";
import { executeShell } from "./execute-shell.js";
import { truncateOutput } from "./truncate.js";

const MAX_OUTPUT_LINES = 200;
const MAX_OUTPUT_BYTES = 20 * 1024;

export const shellTool = {
  type: "function",
  name: "shell",
  description:
    "Execute terminal commands such as git, npm, docker, and other CLI programs.",
  parameters: {
    type: "object",
    properties: {
      command: {
        type: "string",
        description: "The command to execute.",
      },
      workdir: {
        type: "string",
        description: "Working directory for the command.",
      },
      timeout: {
        type: "number",
        description: "Timeout in milliseconds. default 120_000",
      },
    },
    required: ["command", "workdir"],
  },
};

export async function shell(params, context = {}) {
  const cwd = params.workdir;

  // Analyze the command before execution.
  const analysis = analyzeCommand(params.command, cwd);

  // Execute the command.
  const result = await executeShell({
    command: params.command,
    cwd,
    timeout: params.timeout ?? 120_000,
    signal: context.signal,

    onOutput: context.onOutput,
  });

  // Combine stdout and stderr.
  const rawOutput = result.stdout + result.stderr;

  // Limit the amount of output returned
  // to the Agent context.
  const truncated = await truncateOutput(rawOutput, {
    maxLines: MAX_OUTPUT_LINES,

    maxBytes: MAX_OUTPUT_BYTES,
  });

  // {
  //   title: params.command,
  //   analysis,
  //   output: truncated.output,
  //   exitCode: result.code,
  //   timedOut: result.timedOut,
  //   aborted: result.aborted,
  //   truncated: truncated.truncated,
  //   outputPath: truncated.outputPath,
  // }

  return {
    output: truncated.output,
    exitCode: result.code,
    timedOut: result.timedOut,
    aborted: result.aborted,
    truncated: truncated.truncated,
  };
}
