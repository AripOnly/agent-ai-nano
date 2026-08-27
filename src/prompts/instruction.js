import { settings } from "../config/setting.js";
import { workEnv } from "./workEnv.js";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function instruction(name, options = {}) {
  const username = await settings.get("username");

  const insDefault = await readFile(
    path.join(__dirname, `../prompts/${name}.txt`),
    "utf-8",
  );

  let summary = "";
  if (options?.summary) {
    summary = `
# Summary

${options.summary}
`;
  }

  const ins = `
Username: ${username}
Your name: Nano

${insDefault}

${workEnv}

${options?.summary ? summary : ""}
`;

  return ins;
}
