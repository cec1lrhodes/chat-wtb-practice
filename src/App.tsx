import { useMemo, useRef, useState } from "react";
import { AuthPage } from "./components/AuthPage";
import { ChatSidebar } from "./components/ChatSidebar";
import { MessageList } from "./components/MessageList";
import { MessageInput } from "./components/MessageInput";
import { UserSidebar } from "./components/UserSidebar";
import { useSocket } from "./hooks/useSocket";
import { useAuth } from "./hooks/useAuth";

const ChatApp = ({
  token,
  username,
  onLogout,
}: {
  token: string;
  username: string;
  onLogout: () => void;
}) => {
  const {
    chatList,
    onlineUsers,
    totalUsers,
    typingUsers,
    activeChatId,
    activeChat,
    newChatFlag,
    newChatName,
    textAreaValue,
    handleSelectChat,
    handleAddChat,
    handleCreateChat,
    handleCancelChat,
    handleNewChatNameChange,
    handleNewChatNameKeyDown,
    handleTextAreaChange,
    handleKeyDown,
  } = useSocket(token);

  const activeTypingUsers = useMemo(
    () => (activeChatId ? (typingUsers[activeChatId] ?? []) : []),
    [activeChatId, typingUsers],
  );

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const touchStartX = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (deltaX > 60) {
      setIsUserOpen(false);
      setIsChatOpen(true);
    } else if (deltaX < -60) {
      setIsChatOpen(false);
      setIsUserOpen(true);
    }
  };

  const handleCloseAll = () => {
    setIsChatOpen(false);
    setIsUserOpen(false);
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-white overflow-hidden">
      {(isChatOpen || isUserOpen) && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={handleCloseAll}
          aria-hidden="true"
        />
      )}

      <ChatSidebar
        chats={chatList}
        activeChatId={activeChatId}
        newChatFlag={newChatFlag}
        newChatName={newChatName}
        username={username}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onSelectChat={handleSelectChat}
        onAddChat={handleAddChat}
        onCreateChat={handleCreateChat}
        onCancelChat={handleCancelChat}
        onNewChatNameChange={handleNewChatNameChange}
        onNewChatNameKeyDown={handleNewChatNameKeyDown}
      />

      <main
        className="flex-1 flex flex-col overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <header className="flex md:hidden items-center justify-between px-4 py-2 border-b border-zinc-800 shrink-0">
          <button
            onClick={() => { setIsUserOpen(false); setIsChatOpen(true) }}
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            aria-label="Відкрити список чатів"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <span className="text-sm font-medium text-zinc-300 truncate px-2">
            {activeChat ? `# ${activeChat.name}` : "Виберіть чат"}
          </span>

          <button
            onClick={() => { setIsChatOpen(false); setIsUserOpen(true) }}
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            aria-label="Відкрити список користувачів"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4a4 4 0 11-8 0 4 4 0 018 0zm6 4a2 2 0 100-4 2 2 0 000 4zM3 16a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
          </button>
        </header>

        <MessageList activeChat={activeChat} typingUsers={activeTypingUsers} />
        <MessageInput
          textAreaValue={textAreaValue}
          onTextAreaChange={handleTextAreaChange}
          onKeyDown={handleKeyDown}
        />
      </main>

      <UserSidebar
        onlineUsers={onlineUsers}
        totalUsers={totalUsers}
        isOpen={isUserOpen}
        onClose={() => setIsUserOpen(false)}
        onLogout={onLogout}
      />
    </div>
  );
};

const App = () => {
  const { token, username, handleAuth, handleLogout } = useAuth();

  if (!token) return <AuthPage onAuth={handleAuth} />;

  return <ChatApp token={token} username={username} onLogout={handleLogout} />;
};

export default App;
