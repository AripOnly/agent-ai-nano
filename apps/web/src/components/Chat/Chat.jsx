import Prompt from "./Prompt.jsx";

export default function Chat({ messages, loading, onSend }) {
  return (
    <section className="flex h-full min-w-0 flex-col">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto flex max-w-4xl flex-col gap-4">
          {messages.length === 0 ? (
            <div className="text-sm text-zinc-500">Nano ready.</div>
          ) : (
            messages.map((message, index) => (
              <Message key={`${message.role}-${index}`} message={message} />
            ))
          )}

          {loading && (
            <div className="text-sm text-zinc-500">Nano is thinking...</div>
          )}
        </div>
      </div>

      <Prompt onSend={onSend} disabled={loading} />
    </section>
  );
}

function Message({ message }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-lg bg-zinc-800 px-4 py-3 text-sm text-zinc-100 whitespace-pre-wrap">
          {message.content}
        </div>
      </div>
    );
  }

  if (message.role === "error") {
    return (
      <div className="rounded border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-500">
        {message.content}
      </div>
    );
  }

  return (
    <div className="max-w-[80%] px-1 py-2 text-sm leading-6 text-zinc-100 whitespace-pre-wrap">
      {message.content}
    </div>
  );
}
