import { useCallback, useState } from "react";

const API_URL = "http://127.0.0.1:3000";

export default function useSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadSessions = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/sessions`);

      if (!response.ok) {
        throw new Error(`Failed to load sessions: ${response.status}`);
      }

      const data = await response.json();

      setSessions(data);

      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const createSession = useCallback(async (name = null) => {
    const response = await fetch(`${API_URL}/api/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create session: ${response.status}`);
    }

    const session = await response.json();

    setSessions((current) => [session, ...current]);

    return session;
  }, []);

  const getHistory = useCallback(async (sessionId) => {
    if (!sessionId) {
      throw new Error("Session ID is required");
    }

    const response = await fetch(
      `${API_URL}/api/sessions/${encodeURIComponent(sessionId)}/history`,
    );

    if (!response.ok) {
      throw new Error(`Failed to load history: ${response.status}`);
    }

    return response.json();
  }, []);

  console.log("SESSIONS:", sessions);

  return {
    sessions,
    loading,
    loadSessions,
    createSession,
    getHistory,
  };
}
