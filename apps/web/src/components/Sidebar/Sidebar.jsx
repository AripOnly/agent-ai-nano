export default function Sidebar({
  sessions = [],
  activeSessionId,
  onSelectSession,
}) {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-zinc-800 bg-zinc-950">
      <div className="border-b border-zinc-800 px-4 py-3">
        <h2 className="font-semibold text-zinc-100">Sessions</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {sessions.map((session) => {
          const active = session.id === activeSessionId;

          return (
            <button
              key={session.id}
              type="button"
              onClick={() => onSelectSession(session.id)}
              className={`mb-1 w-full rounded px-3 py-2 text-left text-sm ${
                active
                  ? "bg-zinc-800 text-zinc-100"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
              }`}
            >
              <div className="truncate">{session.name}</div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
