import { config } from "../config/setting.js";

const apiKey = config.get("serper_api_key");

export async function WebSearch({ query }) {
  try {
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

    return { success: true, content: data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function WebScrape({ url }) {
  try {
    const response = await fetch("https://scrape.serper.dev", {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        includeMarkdown: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();

    return { success: true, content: result.markdown ?? "" };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
