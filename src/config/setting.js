// src/config/settings.js

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SETTINGS_PATH = path.join(__dirname, "../../config/settings.json");

let cachedSettings = null;
let cachePromise = null;

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
          serper_api_key: null,
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

async function getSettings() {
  if (cachedSettings) {
    return cachedSettings;
  }

  if (!cachePromise) {
    cachePromise = load().then((settings) => {
      cachedSettings = settings;
      return settings;
    });
  }

  return cachePromise;
}

async function getAll() {
  return await getSettings();
}

async function get(key) {
  const settings = await getSettings();
  return settings[key];
}

async function set(key, value) {
  const data = await getSettings();
  data[key] = value;
  await fs.writeFile(SETTINGS_PATH, JSON.stringify(data, null, 2), "utf-8");

  cachedSettings = data;
  return true;
}

export const settings = { get, getAll, set };
