import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

/**
 * Executes a terminal command.
 *
 * @param {string} command
 * @returns {Promise<{
 *   success: boolean,
 *   stdout?: string,
 *   stderr?: string,
 *   code?: number|string|null
 * }>}
 */
export async function Run(command) {
  try {
    const { stdout, stderr } = await execAsync(command, {
      timeout: 5000, // Maksimal 5 detik
      maxBuffer: 2 * 1024 * 1024, // Maksimal output 2 MB
      killSignal: "SIGTERM", // Terminasi jika timeout
      windowsHide: true, // Tidak memunculkan jendela CMD
    });

    return {
      success: true,
      stdout,
      stderr,
    };
  } catch (error) {
    let message = error.stderr || error.message;

    // Timeout
    if (error.killed && error.signal === "SIGTERM") {
      message = "Proses dihentikan karena melebihi batas waktu 5 detik.";
    }

    // Output melebihi maxBuffer
    if (error.code === "ERR_CHILD_PROCESS_STDIO_MAXBUFFER") {
      message = "Output proses melebihi batas maksimal 2 MB.";
    }

    return {
      success: false,
      stdout: error.stdout ?? "",
      stderr: message,
      code: error.code ?? null,
    };
  }
}
