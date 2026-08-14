import { workEnv } from "./workEnv.js";
import { readFile } from "fs/promises";

export async function system() {
  const insDefault = await readFile(
    `${process.cwd()}/src/prompts/default.txt`,
    "utf-8",
  );

  const ins = `
  ${insDefault}
  ${workEnv}
  `;

  return ins;
}
