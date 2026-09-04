import Sidebar from "../Sidebar/Sidebar.jsx";
import Chat from "../Chat/Chat.jsx";

export default function Layout({
  sessions = [],
  activeSessionId,
  onSelectSession,
  messages = [],
  onSend,
  loading,
  connected,
}) {
  const activeSession = sessions.find(
    (session) => session.id === activeSessionId,
  );

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950">
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={onSelectSession}
      />

      <main className="min-w-0 flex-1">
        <Chat
          session={activeSession}
          messages={messages}
          onSend={onSend}
          loading={loading}
          connected={connected}
        />
      </main>
    </div>
  );
}
