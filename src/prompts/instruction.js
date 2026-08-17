import { workEnv } from "./workEnv.js";
import { readFile } from "fs/promises";

export async function instruction(name) {
  const insDefault = await readFile(
    `${process.cwd()}/src/prompts/${name}.txt`,
    "utf-8",
  );

  const ins = `
  ${insDefault}
  ${workEnv}
  `;

  return ins;
}
