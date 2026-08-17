// apps/cli/components/monokai.js
// Syntax highlighting powered by highlight.js, colored with the Monokai
// palette and rendered as Ink <Text> color segments. Languages are imported
// individually from the core module to keep the bundle small.

import hljs from "highlight.js/lib/core";

import bash from "highlight.js/lib/languages/bash";
import c from "highlight.js/lib/languages/c";
import cpp from "highlight.js/lib/languages/cpp";
import css from "highlight.js/lib/languages/css";
import diff from "highlight.js/lib/languages/diff";
import go from "highlight.js/lib/languages/go";
import java from "highlight.js/lib/languages/java";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import kotlin from "highlight.js/lib/languages/kotlin";
import markdown from "highlight.js/lib/languages/markdown";
import php from "highlight.js/lib/languages/php";
import plaintext from "highlight.js/lib/languages/plaintext";
import python from "highlight.js/lib/languages/python";
import ruby from "highlight.js/lib/languages/ruby";
import rust from "highlight.js/lib/languages/rust";
import sql from "highlight.js/lib/languages/sql";
import swift from "highlight.js/lib/languages/swift";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import yaml from "highlight.js/lib/languages/yaml";

for (const [name, lang] of [
  ["bash", bash],
  ["c", c],
  ["cpp", cpp],
  ["css", css],
  ["diff", diff],
  ["go", go],
  ["java", java],
  ["javascript", javascript],
  ["json", json],
  ["kotlin", kotlin],
  ["markdown", markdown],
  ["php", php],
  ["plaintext", plaintext],
  ["python", python],
  ["ruby", ruby],
  ["rust", rust],
  ["sql", sql],
  ["swift", swift],
  ["typescript", typescript],
  ["xml", xml],
  ["yaml", yaml],
]) {
  hljs.registerLanguage(name, lang);
}

// Monokai palette, mapped from highlight.js token classes.
const MONOKAI = {
  keyword: "#f92672",
  "selector-tag": "#f92672",
  name: "#f92672",
  attr: "#f92672",
  symbol: "#66d9ef",
  attribute: "#66d9ef",
  number: "#ae81ff",
  bullet: "#ae81ff",
  regexp: "#ae81ff",
  literal: "#ae81ff",
  link: "#ae81ff",
  string: "#e6db74",
  type: "#e6db74",
  built_in: "#e6db74",
  "builtin-name": "#e6db74",
  "selector-id": "#e6db74",
  "selector-attr": "#e6db74",
  "selector-pseudo": "#e6db74",
  addition: "#e6db74",
  variable: "#e6db74",
  "template-variable": "#e6db74",
  code: "#a6e22e",
  title: "#a6e22e",
  section: "#a6e22e",
  "selector-class": "#a6e22e",
  comment: "#75715e",
  quote: "#75715e",
  deletion: "#75715e",
  meta: "#75715e",
};

// Fallback color for inline code whose language cannot be detected.
const INLINE_FALLBACK = "#e6db74";

// Minimum relevance for an auto-detected inline snippet to be colored.
const INLINE_MIN_RELEVANCE = 2;

// Resolve a space-separated list of hljs classes to a Monokai hex color.
// highlight.js prefixes emitted classes with "hljs-" (e.g. "hljs-keyword").
function classToColor(classes) {
  for (const raw of classes.split(/\s+/)) {
    const cls = raw.replace(/^hljs-/, "");
    const hex = MONOKAI[cls];
    if (hex) return hex;
  }
  return undefined;
}

// Heuristic: only treat an inline snippet as real code when it carries code
// signals (quotes, operators, or a function-call), so bare words and paths
// (filenames, hex colors) are not miscolored by auto-detection.
function looksLikeCode(text) {
  return /["'`]/.test(text) || /[=;{}[\]]/.test(text) || /[A-Za-z_$][\w$]*\s*\(/.test(text);
}

// Decode HTML entities emitted by highlight.js back into plain characters.
function decodeEntities(text) {
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

// Parse highlight.js HTML output into color segments. Handles nested spans and
// class lists, decoding entities in the process.
function parseHighlight(html) {
  const segments = [];
  const TOKEN_RE = /<span class="([^"]+)">|<\/span>/g;
  let buffer = "";
  let color = undefined;
  let last = 0;

  const flush = () => {
    if (buffer) {
      segments.push({ text: decodeEntities(buffer), color });
      buffer = "";
    }
  };

  for (const m of html.matchAll(TOKEN_RE)) {
    if (m.index > last) buffer += html.slice(last, m.index);
    if (m[0].startsWith("</span>")) {
      flush();
      color = undefined;
    } else {
      flush();
      color = classToColor(m[1]);
    }
    last = m.index + m[0].length;
  }
  if (last < html.length) buffer += html.slice(last);
  flush();

  return segments;
}

// Split a flat list of color segments into per-line segment arrays, treating
// embedded newlines as line breaks.
function splitSegmentsToLines(segments) {
  const lines = [];
  let current = [];

  for (const seg of segments) {
    const parts = seg.text.split("\n");
    for (let i = 0; i < parts.length; i++) {
      if (i > 0) {
        lines.push(current.length ? current : [{ text: " " }]);
        current = [];
      }
      if (parts[i] !== "") {
        current.push({ text: parts[i], color: seg.color });
      }
    }
  }
  lines.push(current.length ? current : [{ text: " " }]);

  return lines;
}

// Highlight a whole code block and return an array of lines, each an array of
// { text, color } segments. Unknown languages fall back to plain text.
export function highlightBlock(code, lang) {
  const source = String(code ?? "").replace(/\n$/, "");
  let html;

  try {
    if (lang && hljs.getLanguage(lang)) {
      html = hljs.highlight(source, { language: lang, ignoreIllegals: true }).value;
    } else {
      html = hljs.highlightAuto(source).value;
    }
  } catch {
    return source.split("\n").map((line) => (line ? [{ text: line }] : [{ text: " " }]));
  }

  return splitSegmentsToLines(parseHighlight(html));
}

// Highlight a short inline snippet. Falls back to the INLINE_FALLBACK color
// when no language is detected with enough confidence or the text has no code
// signals.
export function highlightInline(code) {
  const text = String(code ?? "");
  try {
    const result = hljs.highlightAuto(text);
    if (result.language && result.relevance >= INLINE_MIN_RELEVANCE && looksLikeCode(text)) {
      return parseHighlight(result.value);
    }
  } catch {
    // fall through to the fallback color
  }
  return [{ text, color: INLINE_FALLBACK }];
}

// Resolve a raw language tag to its canonical display name (e.g. "js" →
// "JavaScript"), falling back to the original tag when unknown.
export function languageName(lang) {
  const def = hljs.getLanguage(lang);
  return def?.name ?? String(lang ?? "");
}
