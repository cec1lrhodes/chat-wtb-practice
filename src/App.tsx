import { useState } from "react";

function App() {
  const [textAreaValue, setTextAreaValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const handleSendMessage = () => {
    if (textAreaValue.trim() === "") return;

    setMessages([...messages, textAreaValue]);
    setTextAreaValue("");
    console.log(messages);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleTextAreaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const value = event.target.value;

    setTextAreaValue(value);
    console.log(value);
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-white overflow-hidden">
      {/* Ліва панель — чати */}
      <aside className="w-60 shrink-0 border-r border-zinc-800 flex flex-col">
        <div className="px-4 py-3 border-b border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
            Chats
          </h2>
        </div>
        <nav className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
          {["General", "Design", "Backend", "Random"].map((chat) => (
            <button
              key={chat}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
              aria-label={`Open chat ${chat}`}
            >
              # {chat}
            </button>
          ))}
        </nav>
      </aside>
      {/* Центр — область повідомлень + textarea */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4">
          {/* Тут будуть повідомлення */}
        </div>
        {/* Textarea внизу */}
        <div className="p-4 border-t border-zinc-800">
          <textarea
            value={textAreaValue}
            onChange={handleTextAreaChange}
            onKeyDown={handleKeyDown}
            rows={3}
            placeholder="Text"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 resize-none focus:outline-none focus:ring-2 focus:ring-zinc-600 transition"
            aria-label="Message input"
          />
        </div>
      </main>
      {/* Права панель — юзери */}
      <aside className="w-52 shrink-0 border-l border-zinc-800 flex flex-col">
        <div className="px-4 py-3 border-b border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
            Users
          </h2>
        </div>
        <ul className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
          {["User 1", "User 2"].map((user) => (
            <li
              key={user}
              className="px-3 py-2 rounded-lg text-sm text-zinc-300 flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
              {user}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

export default App;
