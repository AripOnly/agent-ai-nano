// src/tools/shell/analyze.js

import path from "node:path";

const FILE_COMMANDS = new Set([
  "rm",
  "cp",
  "mv",
  "mkdir",
  "touch",
  "chmod",
  "chown",
  "cat",
]);

const POWERSHELL_FILE_COMMANDS = new Set([
  "get-content",
  "set-content",
  "add-content",
  "copy-item",
  "move-item",
  "remove-item",
  "new-item",
  "rename-item",
]);

const CWD_COMMANDS = new Set(["cd", "chdir", "pushd", "popd"]);

function unquote(value) {
  if (value.length < 2) {
    return value;
  }

  const first = value[0];
  const last = value[value.length - 1];

  if ((first === '"' || first === "'") && first === last) {
    return value.slice(1, -1);
  }

  return value;
}

function resolvePath(value, cwd) {
  const clean = unquote(value);

  if (clean === "~") {
    return process.env.HOME ?? process.env.USERPROFILE ?? cwd;
  }

  if (clean.startsWith("~/")) {
    const home = process.env.HOME ?? process.env.USERPROFILE ?? cwd;

    return path.join(home, clean.slice(2));
  }

  return path.resolve(cwd, clean);
}

function looksLikePath(value) {
  if (!value) {
    return false;
  }

  if (value.startsWith("-")) {
    return false;
  }

  if (value.startsWith("$")) {
    return false;
  }

  return (
    value.includes("/") ||
    value.includes("\\") ||
    value.startsWith(".") ||
    value.startsWith("~")
  );
}

/**
 * Analyze a shell command before execution.
 */
export function analyzeCommand(command, cwd = process.cwd()) {
  if (typeof command !== "string" || command.trim() === "") {
    throw new Error("Command must be a non-empty string.");
  }

  const tokens = command.match(/"[^"]*"|'[^']*'|\S+/g) ?? [];

  const name = tokens[0] ? unquote(tokens[0]).toLowerCase() : "";

  const fileCommand =
    FILE_COMMANDS.has(name) || POWERSHELL_FILE_COMMANDS.has(name);

  const cwdCommand = CWD_COMMANDS.has(name);

  const paths = [];

  if (fileCommand) {
    for (const token of tokens.slice(1)) {
      if (!looksLikePath(token)) {
        continue;
      }

      paths.push(resolvePath(token, cwd));
    }
  }

  return {
    command,
    name,
    cwd,
    fileCommand,
    cwdCommand,
    paths,
  };
}
