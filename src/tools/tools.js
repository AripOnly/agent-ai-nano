// src/tools/tools.js

import { read, readTool } from "./read.js";
import { write, writeTool } from "./write.js";
import { webSearch, webSearchTool } from "./web-search.js";
import { webFetch, webFetchTool } from "./web-fetch.js";
import { shell, shellTool } from "./shell/shell.js";

export const tools = {
  read,
  write,
  shell,
  webSearch,
  webFetch,
};

export const schema = {
  readTool,
  writeTool,
  shellTool,
  webSearchTool,
  webFetchTool,
};
