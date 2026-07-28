import fs from "fs/promises";
import path from "path";

/**
 * Tool Read
 *
 * @param {Object} params
 * @param {string} params.path
 * @param {number} [params.start_line]
 * @param {number} [params.end_line]
 */
export async function Read({ path: filePath, start_line, end_line }) {
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
