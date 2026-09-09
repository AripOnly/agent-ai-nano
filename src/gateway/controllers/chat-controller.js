// src/gateway/chat-controller.js

import { agent } from "../../agents/agent.js";
import { EVENT } from "../../shared/event-type.js";

export async function chatController(req, res, next) {
  try {
    const { name, prompt, session_id } = req.body;

    if (!name || !prompt || !session_id) {
      return res.status(400).json({
        role: EVENT.ERROR,
        content: "Missing required fields: name, prompt, or session_id",
      });
    }

    res.status(200);

    res.setHeader("Content-Type", "event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    for await (const event of agent({ name, prompt, session_id })) {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    }

    res.write(`data: ${JSON.stringify({ type: EVENT.DONE })}\n\n`);
    res.end();
  } catch (error) {
    console.error("Error in chat controller:", error);
    res
      .status(500)
      .json({ role: EVENT.ERROR, content: "Internal server error" });
  }
}
