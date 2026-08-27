// src/tools/shell/truncate.js

import { mkdir, writeFile } from "node:fs/promises";

import path from "node:path";
import os from "node:os";

const DEFAULT_MAX_LINES = 200;
const DEFAULT_MAX_BYTES = 20 * 1024;

/**
 * Calculate the byte size of a string.
 */
function byteLength(text) {
  return Buffer.byteLength(text, "utf8");
}

/**
 * Keep the last part of the output.
 *
 * We keep the tail because the end of a command output
 * often contains the final status, errors, or summary.
 */
function tail(text, maxLines, maxBytes) {
  const lines = text.split("\n");

  if (lines.length <= maxLines && byteLength(text) <= maxBytes) {
    return {
      text,
      truncated: false,
    };
  }

  const result = [];
  let bytes = 0;

  for (let i = lines.length - 1; i >= 0 && result.length < maxLines; i--) {
    const line = lines[i];

    // +1 accounts for the newline between lines.
    const size = byteLength(line) + (result.length > 0 ? 1 : 0);

    if (bytes + size > maxBytes) {
      break;
    }

    result.unshift(line);
    bytes += size;
  }

  return {
    text: result.join("\n"),
    truncated: true,
  };
}

/**
 * Save the complete command output to a temporary file.
 */
async function saveOutput(text) {
  const directory = path.join(os.tmpdir(), "nano-shell");

  await mkdir(directory, {
    recursive: true,
  });

  const filename = `shell-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}.log`;

  const filePath = path.join(directory, filename);

  await writeFile(filePath, text, "utf8");

  return filePath;
}

/**
 * Truncate command output while preserving
 * the complete output on disk.
 */
export async function truncateOutput(text, options = {}) {
  const maxLines = options.maxLines ?? DEFAULT_MAX_LINES;

  const maxBytes = options.maxBytes ?? DEFAULT_MAX_BYTES;

  if (typeof text !== "string") {
    throw new Error("Output must be a string.");
  }

  if (!Number.isInteger(maxLines) || maxLines <= 0) {
    throw new Error("maxLines must be a positive integer.");
  }

  if (!Number.isInteger(maxBytes) || maxBytes <= 0) {
    throw new Error("maxBytes must be a positive integer.");
  }

  const result = tail(text, maxLines, maxBytes);

  if (!result.truncated) {
    return {
      output: text,
      truncated: false,
      outputPath: null,
    };
  }

  const outputPath = await saveOutput(text);

  return {
    output:
      "...output truncated...\n\n" +
      `Full output saved to: ${outputPath}\n\n` +
      result.text,

    truncated: true,
    outputPath,
  };
}
