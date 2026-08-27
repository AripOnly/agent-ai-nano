import { settings } from "../config/setting.js";

const year = new Date().getFullYear();

export const webSearchTool = {
  type: "function",
  name: "webSearch",
  description: `
Search the web for information, pages, or URLs relevant to the user's request.

Use webSearch when:

- You need to discover information that is not available in the current context.
- The user asks to search, find, look up, or research something on the web.
- You need to find a specific web page or URL.
- You need up-to-date or current information.

When searching for the latest, newest, or current information,
include the current year (${year}) in the search query.

For example:
"latest Node.js version ${year}"

Do not use webSearch when:

- The user has already provided a specific URL and you only need to read its content. Use webFetch instead.
- You already have enough information to answer the user's request.
- You are using webFetch to read a page that you already have the URL for.

Keep the search query focused and relevant to the user's request.
Avoid making multiple searches when a single search is sufficient.
`,
  parameters: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "The search query.",
      },
    },
    required: ["query"],
  },
};

export async function webSearch({ query }) {
  try {
    const apiKey = await settings.get("serper_api_key");

    if (!apiKey) {
      return {
        success: false,
        error: "Serper API key not configured",
      };
    }

    const response = await fetch("https://google.serper.dev/search", {
      method: "POST",

      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        q: query,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const results = await response.json();

    let data = "";

    for (const result of results.organic ?? []) {
      if (result.title) {
        data += `title: ${result.title}\n`;
      }

      if (result.link) {
        data += `link: ${result.link}\n`;
      }

      if (result.snippet) {
        data += `snippet: ${result.snippet}\n`;
      }

      if (result.date) {
        data += `date: ${result.date}\n`;
      }

      data += "\n";
    }

    return {
      success: true,
      content: data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
