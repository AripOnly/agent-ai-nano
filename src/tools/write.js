import fs from "fs/promises";
import path from "path";

export const writeTool = {
  type: "function",
  name: "write",

  description: `
Create, overwrite, edit, or insert text into a UTF-8 file in the workspace.

Use OVERWRITE
- when creating a new file.
- when replacing the entire file.

Use LINE_EDIT
- when the user wants to modify existing lines.
- start_line and end_line are required.
- maximum editable range is 200 lines.

Use INSERT
- when the user explicitly asks to insert or add lines.
- start_line is required.
- existing lines must remain unchanged.

The tool automatically prevents path traversal and writing outside the workspace.
`,

  parameters: {
    type: "object",

    properties: {
      path: {
        type: "string",
        description: "Relative file path.",
      },

      content: {
        type: "string",
        description: "Text that will be written.",
      },

      mode: {
        type: "string",
        enum: ["OVERWRITE", "LINE_EDIT", "INSERT"],
      },

      start_line: {
        type: "integer",
        minimum: 1,
        description: "Required for LINE_EDIT and INSERT.",
      },

      end_line: {
        type: "integer",
        minimum: 1,
        description: "Required only for LINE_EDIT.",
      },
    },

    required: ["path", "content", "mode"],
  },
};

const MODE = Object.freeze({
  OVERWRITE: "OVERWRITE",
  LINE_EDIT: "LINE_EDIT",
  INSERT: "INSERT",
});

const VALID_MODE = new Set(Object.values(MODE));

function fail(error) {
  return {
    success: false,
    error,
  };
}

function ok(message) {
  return {
    success: true,
    message,
  };
}

async function ensureDirectory(dir) {
  try {
    const stat = await fs.stat(dir);

    if (!stat.isDirectory()) {
      throw Object.assign(new Error("Folder tujuan tidak valid."), {
        code: "DIR_NOT_FOUND",
      });
    }
  } catch (err) {
    switch (err.code) {
      case "ENOENT":
      case "DIR_NOT_FOUND":
        throw new Error("Folder tujuan tidak ditemukan.");

      case "EACCES":
        throw new Error("Tidak memiliki izin mengakses folder.");

      default:
        throw err;
    }
  }
}

async function loadTextFile(filePath) {
  const buffer = await fs.readFile(filePath);

  // Deteksi binary sederhana
  const sample = buffer.subarray(0, 4096);

  for (const byte of sample) {
    if (byte === 0) {
      const err = new Error(
        "Format file tidak valid. Hanya file teks yang didukung.",
      );

      err.code = "NOT_TEXT";

      throw err;
    }
  }

  const text = buffer.toString("utf8");

  return text.replace(/\r?\n$/, "").split(/\r?\n/);
}

async function saveFile(filePath, lines) {
  try {
    const content = Array.isArray(lines) ? lines.join("\n") + "\n" : lines;

    await fs.writeFile(filePath, content, "utf8");
  } catch (err) {
    if (err.code === "EACCES") {
      throw new Error("Tidak memiliki izin menulis file.");
    }

    throw err;
  }
}

function normalizeContent(content) {
  return content.replace(/\r?\n$/, "").split(/\r?\n/);
}

export async function write({
  path: filePath,
  content,
  mode,
  start_line,
  end_line,
}) {
  try {
    if (typeof filePath !== "string" || filePath.trim() === "") {
      return fail("Parameter 'path' wajib diisi.");
    }

    if (typeof content !== "string") {
      return fail("Parameter 'content' harus berupa string.");
    }

    if (!VALID_MODE.has(mode)) {
      return fail("Mode harus OVERWRITE, LINE_EDIT atau INSERT.");
    }

    const resolvedPath = path.resolve(filePath);

    await ensureDirectory(path.dirname(resolvedPath));

    /**
     * Replace seluruh file
     */
    if (mode === MODE.OVERWRITE) {
      await saveFile(resolvedPath, content);

      return ok("File berhasil ditulis.");
    }

    let lines;

    try {
      lines = await loadTextFile(resolvedPath);
    } catch (err) {
      switch (err.code) {
        case "ENOENT":
          return fail("File tidak ditemukan.");

        case "EACCES":
          return fail("Tidak memiliki izin membaca file.");

        case "NOT_TEXT":
          return fail(err.message);

        default:
          return fail(err.message);
      }
    }

    const newLines = normalizeContent(content);

    /**
     * Insert baris baru
     */
    if (mode === MODE.INSERT) {
      if (!Number.isInteger(start_line)) {
        return fail("start_line wajib berupa integer.");
      }

      if (start_line < 1) {
        return fail("Nomor baris dimulai dari 1.");
      }

      if (newLines.length > 200) {
        return fail("Maksimal menyisipkan 200 baris.");
      }

      if (start_line > lines.length + 1) {
        return fail("start_line melebihi jumlah baris yang diperbolehkan.");
      }

      lines.splice(start_line - 1, 0, ...newLines);

      await saveFile(resolvedPath, lines);

      return ok("Baris berhasil disisipkan.");
    }

    /**
     * Replace range baris
     */
    if (!Number.isInteger(start_line) || !Number.isInteger(end_line)) {
      return fail("start_line dan end_line wajib berupa integer.");
    }

    if (start_line < 1 || end_line < 1) {
      return fail("Nomor baris dimulai dari 1.");
    }

    if (end_line < start_line) {
      return fail("end_line tidak boleh lebih kecil dari start_line.");
    }

    const rangeSize = end_line - start_line + 1;

    if (rangeSize > 200) {
      return fail("Maksimal edit adalah 200 baris.");
    }

    if (start_line > lines.length) {
      return fail("start_line melebihi jumlah baris file.");
    }

    if (end_line > lines.length) {
      return fail("end_line melebihi jumlah baris file.");
    }

    lines.splice(start_line - 1, rangeSize, ...newLines);

    await saveFile(resolvedPath, lines);

    return ok("Baris berhasil diperbarui.");
  } catch (err) {
    return fail(err.message);
  }
}
