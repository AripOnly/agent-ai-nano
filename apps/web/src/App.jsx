import Layout from "./components/Layout/Layout.jsx";
import useSessions from "./hooks/useSessions.js";
import useSession from "./hooks/useSession.js";

export default function App() {
  const { sessions, activeSessionId, setActiveSessionId } = useSessions();

  const { messages, sendMessage, loading, connected } =
    useSession(activeSessionId);

  return (
    <Layout
      sessions={sessions}
      activeSessionId={activeSessionId}
      onSelectSession={setActiveSessionId}
      messages={messages}
      onSend={sendMessage}
      loading={loading}
      connected={connected}
    />
  );
}
