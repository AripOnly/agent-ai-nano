// function read() {
//   return "read";
// }

// function write() {
//   return "write";
// }

// function find({ command }) {
//   return command;
// }

// const tools = {
//   read,
//   write,
//   find,
// };

// const toolCall = {
//   id: "aaaa",
//   name: "find",
//   argument: { command: "dir" },
// };

// const { name, argument } = toolCall;

// const extractTool = Object.keys(tools);
// const toolFind = extractTool.find((toolName) => toolName === name);

// if (toolFind !== undefined) {
//   console.log(tools[name](argument));
// } else {
//   console.log("tool not found");
// }

import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
console.log(__dirname);
