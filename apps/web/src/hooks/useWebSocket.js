import { useCallback, useEffect, useRef, useState } from "react";

const WS_URL = "ws://127.0.0.1:3000/ws";

export default function useWebSocket(onMessage) {
  const socketRef = useRef(null);
  const onMessageRef = useRef(onMessage);

  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  const connect = useCallback(() => {
    if (
      socketRef.current &&
      socketRef.current.readyState !== WebSocket.CLOSED
    ) {
      return;
    }

    const socket = new WebSocket(WS_URL);

    socketRef.current = socket;

    socket.onopen = () => {
      setConnected(true);
      setError(null);
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        onMessageRef.current?.(message);
      } catch {
        setError("Invalid message received from gateway");
      }
    };

    socket.onclose = () => {
      setConnected(false);
    };

    socket.onerror = () => {
      setError("WebSocket connection error");
    };
  }, []);

  const disconnect = useCallback(() => {
    socketRef.current?.close();
    socketRef.current = null;
    setConnected(false);
  }, []);

  const send = useCallback((message) => {
    const socket = socketRef.current;

    if (!socket || socket.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket is not connected");
    }

    socket.send(JSON.stringify(message));
  }, []);

  useEffect(() => {
    connect();

    return disconnect;
  }, [connect, disconnect]);

  return {
    connected,
    error,
    send,
    connect,
    disconnect,
  };
}
