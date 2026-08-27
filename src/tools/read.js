import fs from "fs/promises";
import path from "path";

export const readTool = {
  type: "function",
  name: "read",
  description:
    "Read a UTF-8 text file from the workspace. Never use this tool for images or binary files. Use this tool whenever the user asks to view, inspect, analyze, summarize, debug, search, or quote the contents of a local file. If only part of a file is needed, provide start_line and end_line. Never request more than 200 lines in one call.",

  parameters: {
    type: "object",
    additionalProperties: false,
    properties: {
      path: {
        type: "string",
        description:
          "Relative path inside the workspace, for example: src/index.js",
      },
      start_line: {
        type: "integer",
        minimum: 1,
        description: "First line to read (1-based).",
      },
      end_line: {
        type: "integer",
        minimum: 1,
        description: "Last line to read (1-based). Maximum 200 lines.",
      },
    },
    required: ["path"],
  },
};

export async function read({ path: filePath, start_line, end_line }) {
  try {
    if (typeof filePath !== "string" || filePath.trim() === "") {
      return {
        success: false,
        error: "Parameter 'path' wajib diisi.",
      };
    }

    // Normalisasi path
    const resolvedPath = path.resolve(path.normalize(filePath));

    let stat;

    try {
      stat = await fs.stat(resolvedPath);
    } catch (err) {
      if (err.code === "ENOENT") {
        return {
          success: false,
          error: "File tidak ditemukan.",
        };
      }

      if (err.code === "EACCES") {
        return {
          success: false,
          error: "Tidak memiliki izin membaca file.",
        };
      }

      return {
        success: false,
        error: err.message,
      };
    }

    if (!stat.isFile()) {
      return {
        success: false,
        error: "Path bukan sebuah file.",
      };
    }

    const buffer = await fs.readFile(resolvedPath);

    if (buffer.includes(0)) {
      return {
        success: false,
        error: "Format file tidak valid. Hanya file teks yang didukung.",
      };
    }

    const text = buffer.toString("utf8").replace(/^\uFEFF/, "");

    const lines = text.split(/\r?\n/);
    const totalLines = lines.length;

    if (
      totalLines > 100 &&
      (start_line === undefined || end_line === undefined)
    ) {
      return {
        success: false,
        error:
          "File memiliki lebih dari 100 baris. Parameter start_line dan end_line wajib diisi.",
      };
    }

    start_line ??= 1;
    end_line ??= totalLines;

    if (!Number.isInteger(start_line) || !Number.isInteger(end_line)) {
      return {
        success: false,
        error: "start_line dan end_line harus berupa integer.",
      };
    }

    if (start_line < 1 || end_line < 1) {
      return {
        success: false,
        error: "Nomor baris dimulai dari 1.",
      };
    }

    if (start_line > end_line) {
      return {
        success: false,
        error: "start_line tidak boleh lebih besar dari end_line.",
      };
    }

    if (end_line - start_line + 1 > 200) {
      return {
        success: false,
        error: "Maksimal pembacaan adalah 200 baris.",
      };
    }

    if (start_line > totalLines) {
      return {
        success: false,
        error: "start_line melebihi jumlah baris file.",
      };
    }

    return {
      success: true,
      content: lines
        .slice(start_line - 1, Math.min(end_line, totalLines))
        .join("\n"),
    };
  } catch (err) {
    return {
      success: false,
      error: err.message,
    };
  }
}
