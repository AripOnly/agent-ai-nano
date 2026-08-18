import { useCallback, useEffect, useState } from "react";

import { agent } from "../../../src/agents/agent.js";
import {
  conversation,
  nameFromPrompt,
} from "../../../src/session/conversation.js";

export function useChat() {
  const [chat, setChat] = useState([]);
  const [history, setHistory] = useState([]);
  const [thinking, setThinking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const [sessions, setSessions] = useState([]);

  const refreshSessions = useCallback(() => {
    setSessions(conversation.listSessions());
  }, []);

  useEffect(() => {
    refreshSessions();
  }, [refreshSessions]);

  const refreshHistory = useCallback(async (sessionId) => {
    setHistory(await conversation.getHistory(sessionId));
  }, []);

  const send = useCallback(
    async (prompt) => {
      if (!prompt) return;

      let session = activeSession;

      try {
        if (!session) {
          session = conversation.createSession(nameFromPrompt(prompt));
          console.clear();
          setActiveSession(session);
        } else if (conversation.getHistory(session.id).length === 0) {
          const name = nameFromPrompt(prompt);
          conversation.renameSession(session.id, name);
          setActiveSession({ ...session, name });
        }
      } catch (error) {
        setChat((prev) => [
          ...prev,
          { role: "error", content: { message: error.message } },
        ]);
        return;
      }

      setLoading(true);
      setChat((prev) => [...prev, { role: "user", content: { text: prompt } }]);
      setThinking(true);

      for await (const event of agent({
        name: "nano",
        prompt,
        session_id: session.id,
      })) {
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

      const result = await conversation.getHistory(session.id);
      setHistory(result);
      setChat([]);
      setThinking(false);
      setLoading(false);
      refreshSessions();
    },
    [activeSession, refreshSessions],
  );

  const newSession = useCallback(() => {
    console.clear();
    setActiveSession(null);
    setChat([]);
    setHistory([]);
    setLoading(false);
    setThinking(false);
    refreshSessions();
  }, [refreshSessions]);

  const switchSession = useCallback(
    (sessionId) => {
      const session = conversation.getSessionById(sessionId);
      if (!session) return;
      console.clear();
      setActiveSession(session);
      setChat([]);
      setHistory([]);
      refreshHistory(sessionId);
      refreshSessions();
    },
    [refreshHistory, refreshSessions],
  );

  const deleteSession = useCallback(
    (sessionId) => {
      if (!sessionId) return;
      conversation.deleteSession(sessionId);
      console.clear();
      setActiveSession(null);
      setChat([]);
      setHistory([]);
      setLoading(false);
      setThinking(false);
      refreshSessions();
    },
    [refreshSessions],
  );

  const renameSession = useCallback(
    (sessionId, name) => {
      if (!name || !name.trim()) return;
      const finalName = name.trim();
      conversation.renameSession(sessionId, finalName);
      setActiveSession((prev) =>
        prev?.id === sessionId ? { ...prev, name: finalName } : prev,
      );
      refreshSessions();
    },
    [refreshSessions],
  );

  return {
    chat,
    history,
    thinking,
    loading,
    send,
    sessions,
    activeSession,
    newSession,
    switchSession,
    deleteSession,
    renameSession,
  };
}
