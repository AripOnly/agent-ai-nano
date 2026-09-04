import { useState } from "react";

export default function Prompt({ onSend, disabled = false }) {
  const [value, setValue] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const prompt = value.trim();

    if (!prompt || disabled) return;

    onSend(prompt);
    setValue("");
  }

  return (
    <div className="border-t border-zinc-800 p-4">
      <form onSubmit={handleSubmit} className="mx-auto flex max-w-4xl gap-2">
        <input
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          disabled={disabled}
          placeholder="Message Nano..."
          className="min-w-0 flex-1 rounded border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-zinc-600 disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="rounded border border-zinc-800 bg-zinc-900 px-5 text-sm text-zinc-100 hover:bg-zinc-800 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
