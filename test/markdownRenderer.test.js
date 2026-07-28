import test from "node:test";
import assert from "node:assert/strict";
import {
  extractPlainText,
  parseMarkdownToAst,
} from "../src/channels/cli/components/markdown/remarkRenderer.js";

test("extractPlainText preserves all visible text from markdown AST", () => {
  const markdown = [
    "# Title",
    "",
    "This sentence should stay visible.",
    "",
    "- first item",
    "- second item with **bold** text",
    "",
    "```js",
    "const value = 1;",
    "```",
  ].join("\n");

  const ast = parseMarkdownToAst(markdown);
  const plainText = extractPlainText(ast);

  assert.ok(plainText.includes("This sentence should stay visible."));
  assert.ok(plainText.includes("first item"));
  assert.ok(plainText.includes("second item with bold text"));
  assert.ok(plainText.includes("const value = 1;"));
});
