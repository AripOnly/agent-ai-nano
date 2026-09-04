// test.js

import express from "express";
import { agent } from "../src/agents/agent.js";

const app = express();
const port = 3000;

// Wajib ditambahkan agar Express bisa membaca JSON dari req.body
app.use(express.json());

app.post("/test", async (req, res) => {
  // 1. Set Header Wajib SSE
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  // 2. Ambil prompt dari client, atau pakai fallback jika kosong
  const name = "nano";
  const session_id = "15aba5c9-14bc-43ac-baaa-e2b29b473fea";
  let prompt = req.body?.prompt;

  console.log(prompt);

  try {
    // 3. Panggil agent dengan format Object {} sesuai fungsi agent.js kamu
    for await (const chunk of agent({ name, prompt, session_id })) {
      // 4. Convert object chunk menjadi JSON String untuk SSE
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
    }
  } catch (error) {
    res.write(
      `data: ${JSON.stringify({ role: "error", content: { message: error.message } })}\n\n`,
    );
  } finally {
    // 5. Tutup koneksi setelah stream selesai
    res.end();
  }

  res.end();
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
