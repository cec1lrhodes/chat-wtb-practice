import { useMemo } from "react";
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

  return (
    <div className="flex h-screen bg-zinc-950 text-white overflow-hidden">
      <ChatSidebar
        chats={chatList}
        activeChatId={activeChatId}
        newChatFlag={newChatFlag}
        newChatName={newChatName}
        username={username}
        onSelectChat={handleSelectChat}
        onAddChat={handleAddChat}
        onCreateChat={handleCreateChat}
        onCancelChat={handleCancelChat}
        onNewChatNameChange={handleNewChatNameChange}
        onNewChatNameKeyDown={handleNewChatNameKeyDown}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
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
