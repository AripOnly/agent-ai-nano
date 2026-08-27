import { shell } from "../src/tools/shell/shell.js";

const result = await shell(
  {
    command: "ls",
  },
  {
    onOutput(event) {
      process.stdout.write(event.text);
    },
  },
);

const data = {
  output: result.output,
  exitCode: result.exitCode,
  timedOut: result.timedOut,
  aborted: result.aborted,
  truncated: result.truncated,
};

console.log(JSON.stringify(data, null, 2));
