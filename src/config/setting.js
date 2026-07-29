// src/config/settings.js

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SETTINGS_PATH = path.join(__dirname, "../../config/settings.json");

async function load() {
  try {
    const text = await fs.readFile(SETTINGS_PATH, "utf-8");
    return JSON.parse(text);
  } catch (error) {
    if (error.code === "ENOENT") {
      const data = JSON.stringify(
        {
          username: null,
          provider: null,
          model: null,
          apiKey: null,
        },
        null,
        2,
      );

      await fs.mkdir(path.dirname(SETTINGS_PATH), { recursive: true });
      await fs.writeFile(SETTINGS_PATH, data, "utf-8");

      return data;
    }

    throw error;
  }
}

async function getAll() {
  return await load();
}

async function get(key) {
  const settings = await load();
  return settings[key];
}

async function set(key, value) {
  const data = await load();
  data[key] = value;
  await fs.writeFile(SETTINGS_PATH, JSON.stringify(data, null, 2), "utf-8");

  return true;
}

export const settings = { get, getAll, set };
