import { access, readFile, writeFile } from "node:fs/promises";

const filePath = `${process.cwd()}/storage/usage/token-usage.json`;

async function fileExist() {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function get() {
  if (await fileExist()) {
    const content = await readFile(filePath, "utf-8");
    return JSON.parse(content);
  } else {
    return {
      input_tokens: 0,
      output_tokens: 0,
      total_tokens: 0,
    };
  }
}

async function save({ input_tokens, output_tokens, total_tokens }) {
  const data = await get();

  data.input_tokens = input_tokens;
  data.output_tokens = output_tokens;
  data.total_tokens = total_tokens;

  await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export const tokenUsage = { save, get };
