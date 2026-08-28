import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MODELS_PATH = path.join(__dirname, "../../config/models.json");

export async function loadModels() {
  try {
    const data = await fs.readFile(MODELS_PATH, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return error?.message ?? `file not found: ${MODELS_PATH}`;
  }
}
