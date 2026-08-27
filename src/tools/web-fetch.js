import { settings } from "../config/setting.js";

export const webFetchTool = {
  type: "function",
  name: "webFetch",
  description: `
  Mengambil dan mengekstrak konten yang dapat dibaca dari halaman web tertentu sebagai markdown.

Gunakan webFetch ketika:
- Pengguna memberikan URL tertentu.

- URL telah diperoleh dari webSearch atau sumber lain.

- Anda perlu membaca atau memeriksa konten halaman web tertentu.

Jangan gunakan webFetch ketika:
- Anda perlu menemukan atau mencari URL. Gunakan webSearch sebagai gantinya.

- Anda sudah memiliki informasi yang dibutuhkan dan tidak memerlukan konten halaman tambahan.

Hanya ambil URL yang relevan dengan tugas pengguna saat ini.

Jangan mengambil beberapa halaman secara tidak perlu.
  `,
  parameters: {
    type: "object",
    properties: {
      url: {
        type: "string",
        description: "The URL of the web page to scrape.",
      },
    },
    required: ["url"],
  },
};

export async function webFetch({ url }) {
  try {
    const apiKey = await settings.get("serper_api_key");
    if (!apiKey) {
      return { success: false, error: "Serper API key not configured" };
    }

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
