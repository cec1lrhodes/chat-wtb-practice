import { useState } from "react";

interface Chat {
  id: number;
  name: string;
  messages: string[];
}

function App() {
  const [textAreaValue, setTextAreaValue] = useState("");
  const [activeChatId, setActiveChatId] = useState<number | null>(null);

  // chats
  const [chats, setChats] = useState<Chat[]>([]);
  // chat buttons logic
  const [newChatName, setNewChatName] = useState("");
  const [newChatFlag, setNewChatFlag] = useState(false);

  const handleSendMessage = () => {
    if (textAreaValue.trim() === "" || activeChatId === null) return;
    setChats(
      chats.map((chat) =>
        chat.id === activeChatId
          ? { ...chat, messages: [...chat.messages, textAreaValue] }
          : chat,
      ),
    );
    setTextAreaValue("");
  };

  const handleSelectChat = (id: number) => {
    setActiveChatId(id);
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
  };

  const handleAddChat = () => {
    setNewChatFlag(true);
  };

  const handleCreateChat = () => {
    if (newChatName.trim() === "") return;
    const newChat: Chat = { id: Date.now(), name: newChatName, messages: [] };
    setChats([...chats, newChat]);
    setActiveChatId(newChat.id);
    setNewChatName("");
    setNewChatFlag(false);
  };

  const handleCancelChat = () => {
    setNewChatName("");
    setNewChatFlag(false);
  };

  const handleNewChatNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;
    setNewChatName(value);
  };

  const handleNewChatNameKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter") {
      handleCreateChat();
    }
    if (event.key === "Escape") {
      handleCancelChat();
    }
  };

  const activeChat = chats.find((chat) => chat.id === activeChatId);

  return (
    <div className="flex h-screen bg-zinc-950 text-white overflow-hidden">
      {/* Ліва панель — чати */}
      <aside className="w-60 shrink-0 border-r border-zinc-800 flex flex-col">
        <div className="px-4 py-3 border-b border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
            Chats
          </h2>
          <button
            onClick={handleAddChat}
            className="text-zinc-400 hover:text-zinc-300 bg-zinc-800 rounded-lg px-4 py-2"
          >
            Add new chat
          </button>
          {newChatFlag && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
              <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-80 flex flex-col gap-4">
                <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">
                  Створити новий чат
                </h3>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-zinc-500 font-mono">
                    введіть назву чату
                  </label>
                  <input
                    value={newChatName}
                    onChange={handleNewChatNameChange}
                    onKeyDown={handleNewChatNameKeyDown}
                    placeholder="new chat"
                    className="bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                    aria-label="New chat name"
                    autoFocus
                  />
                </div>
                <div className="flex justify-between gap-3">
                  <button
                    onClick={handleCancelChat}
                    className="flex-1 py-2 rounded-lg border border-red-600 text-red-500 text-sm hover:bg-red-600/10 transition-colors"
                    aria-label="Скасувати"
                  >
                    Скасувати
                  </button>
                  <button
                    onClick={handleCreateChat}
                    className="flex-1 py-2 rounded-lg border border-green-600 text-green-500 text-sm hover:bg-green-600/10 transition-colors"
                    aria-label="Створити чат"
                  >
                    Створити
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <nav className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => handleSelectChat(chat.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
      ${
        chat.id === activeChatId
          ? "bg-zinc-700 text-white"
          : "text-zinc-300 hover:bg-zinc-800"
      }`}
              aria-label={`Open chat ${chat.name}`}
            >
              # {chat.name}
            </button>
          ))}
        </nav>
      </aside>

      {/* Центр — область повідомлень + textarea */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4">
          {/* Тут будуть повідомлення */}
          {activeChat ? (
            activeChat.messages.map((message, index) => (
              <div
                key={index}
                className="text-sm text-zinc-300 bg-zinc-800 rounded-lg p-2"
              >
                {message}
              </div>
            ))
          ) : (
            <p className="text-zinc-600 text-sm text-center mt-10">
              Виберіть чат
            </p>
          )}
        </div>
        {/* Textarea внизу */}

        <div className="p-4 border-t border-zinc-800 ">
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
