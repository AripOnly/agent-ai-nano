import { useCallback, useEffect, useState } from "react";

import { agent } from "../../../src/agents/agent.js";
import { conversation } from "../../../src/session/conversation.js";

export function useChat() {
  const [chat, setChat] = useState([]);
  const [history, setHistory] = useState([]);
  const [thinking, setThinking] = useState(false);
  const [loading, setLoading] = useState(false);

  const refreshHistory = useCallback(async () => {
    setHistory(await conversation.getHistory());
  }, []);

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  const send = useCallback(async (prompt) => {
    if (!prompt) return;

    setLoading(true);
    setChat((prev) => [...prev, { role: "user", content: { text: prompt } }]);
    setThinking(true);

    for await (const event of agent({ name: "nano", prompt })) {
      if (event.role === "assistant") {
        const text = event.content?.text ?? "";

        setChat((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];

          if (last?.role === "assistant") {
            last.content += text;
          } else {
            next.push({ role: "assistant", content: text });
          }

          return next;
        });
      }

      if (event.role === "tool_call" || event.role === "error") {
        setChat((prev) => [...prev, event]);
      }

      setThinking(event.role === "reasoning_summary");
    }

    const result = await conversation.getHistory();
    setHistory(result);
    setChat([]);
    setThinking(false);
    setLoading(false);
  }, []);

  return { chat, history, thinking, loading, send };
}
