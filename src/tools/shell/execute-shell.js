// src/tools/shell/execute.js

import { spawn } from "node:child_process";

/**
 * Execute a shell command.
 *
 * Supports:
 * - stdout/stderr streaming
 * - timeout
 * - AbortController
 * - Windows PowerShell
 * - Bash on Unix
 */
export function executeShell({
  command,
  cwd = process.cwd(),
  timeout = 120_000,
  signal,
  onOutput,
}) {
  return new Promise((resolve, reject) => {
    if (typeof command !== "string" || command.trim() === "") {
      reject(new Error("Command must be a non-empty string."));
      return;
    }

    if (!Number.isFinite(timeout) || timeout < 0) {
      reject(new Error("Timeout must be a non-negative number."));
      return;
    }

    const isWindows = process.platform === "win32";

    const executable = isWindows ? "powershell.exe" : "bash";

    const args = isWindows
      ? ["-NoLogo", "-NoProfile", "-NonInteractive", "-Command", command]
      : ["-lc", command];

    const child = spawn(executable, args, {
      cwd,
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    });

    let stdout = "";
    let stderr = "";
    let timedOut = false;
    let aborted = false;
    let finished = false;

    const finish = (result) => {
      if (finished) {
        return;
      }

      finished = true;
      resolve(result);
    };

    // Stream stdout as it arrives.
    child.stdout.on("data", (chunk) => {
      const text = chunk.toString();

      stdout += text;

      onOutput?.({
        type: "stdout",
        text,
      });
    });

    // Stream stderr as it arrives.
    child.stderr.on("data", (chunk) => {
      const text = chunk.toString();

      stderr += text;

      onOutput?.({
        type: "stderr",
        text,
      });
    });

    // Handle process errors.
    child.on("error", (error) => {
      if (finished) {
        return;
      }

      finished = true;
      reject(error);
    });

    // Handle AbortController.
    const abortHandler = () => {
      if (finished) {
        return;
      }

      aborted = true;
      child.kill();
    };

    if (signal) {
      if (signal.aborted) {
        abortHandler();
      } else {
        signal.addEventListener("abort", abortHandler, {
          once: true,
        });
      }
    }

    // Handle timeout.
    const timer = setTimeout(() => {
      if (finished) {
        return;
      }

      timedOut = true;
      child.kill();
    }, timeout);

    // Process finished.
    child.on("close", (code, signalName) => {
      clearTimeout(timer);

      signal?.removeEventListener("abort", abortHandler);

      finish({
        code,
        signal: signalName,
        stdout,
        stderr,
        timedOut,
        aborted,
      });
    });
  });
}
