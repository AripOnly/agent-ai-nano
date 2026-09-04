import { useCallback, useMemo, useState } from "react";
import { useGateway } from "./useGateway.js";

export function useChat(sessionId) {
  const { connected, events, sendChat } = useGateway();

  const [sending, setSending] = useState(false);

  const messages = useMemo(() => {
    const result = [];

    for (const event of events) {
      if (event.role !== "assistant") {
        continue;
      }

      const text = event.content?.text;

      if (!text) {
        continue;
      }

      const last = result[result.length - 1];

      if (last?.role === "assistant") {
        last.content += text;
      } else {
        result.push({
          role: "assistant",
          content: text,
        });
      }
    }

    return result;
  }, [events]);

  const send = useCallback(
    (prompt) => {
      if (!sessionId) {
        throw new Error("Session ID is required");
      }

      sendChat({
        sessionId,
        prompt,
      });

      setSending(true);
    },
    [sessionId, sendChat],
  );

  return {
    connected,
    messages,
    sending,
    send,
  };
}
