import { useCallback, useEffect, useRef, useState } from "react";

const GATEWAY_URL = "ws://127.0.0.1:3000/ws";

export function useGateway() {
  const socketRef = useRef(null);

  const [connected, setConnected] = useState(false);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const socket = new WebSocket(GATEWAY_URL);

    socketRef.current = socket;

    socket.onopen = () => {
      setConnected(true);
    };

    socket.onmessage = (message) => {
      try {
        const event = JSON.parse(message.data);

        setEvents((current) => [...current, event]);
      } catch (error) {
        console.error("Invalid Gateway event:", error);
      }
    };

    socket.onclose = () => {
      setConnected(false);
    };

    socket.onerror = (error) => {
      console.error("Gateway WebSocket error:", error);
    };

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, []);

  const sendChat = useCallback(({ sessionId, prompt, agentName = "nano" }) => {
    const socket = socketRef.current;

    if (!socket || socket.readyState !== WebSocket.OPEN) {
      throw new Error("Gateway is not connected");
    }

    if (!sessionId) {
      throw new Error("Session ID is required");
    }

    if (!prompt?.trim()) {
      throw new Error("Prompt cannot be empty");
    }

    socket.send(
      JSON.stringify({
        type: "chat",
        channel: "web",
        session_id: sessionId,
        prompt: prompt.trim(),
        agent_name: agentName,
      }),
    );
  }, []);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  return {
    connected,
    events,
    sendChat,
    clearEvents,
  };
}
