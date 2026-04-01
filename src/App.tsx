import { useChats } from "./hooks/useChats";
import { useMessageInput } from "./hooks/useMessageInput";
import { ChatSidebar } from "./components/ChatSidebar";
import { MessageList } from "./components/MessageList";
import { MessageInput } from "./components/MessageInput";
import { UserSidebar } from "./components/UserSidebar";

const App = () => {
  const {
    chats,
    setChats,
    activeChatId,
    activeChat,
    newChatName,
    newChatFlag,
    handleSelectChat,
    handleAddChat,
    handleCreateChat,
    handleCancelChat,
    handleNewChatNameChange,
    handleNewChatNameKeyDown,
  } = useChats();

  const { textAreaValue, handleTextAreaChange, handleKeyDown } =
    useMessageInput(activeChatId, setChats);

  return (
    <div className="flex h-screen bg-zinc-950 text-white overflow-hidden">
      {/* ЛІВА КОЛОНКА З ЧАТАМИ  */}
      <ChatSidebar
        chats={chats}
        activeChatId={activeChatId}
        newChatFlag={newChatFlag}
        newChatName={newChatName}
        onSelectChat={handleSelectChat}
        onAddChat={handleAddChat}
        onCreateChat={handleCreateChat}
        onCancelChat={handleCancelChat}
        onNewChatNameChange={handleNewChatNameChange}
        onNewChatNameKeyDown={handleNewChatNameKeyDown}
      />
      {/* ІНПУТ ТА ПОВІДОМЛЕННЯ */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <MessageList activeChat={activeChat} />
        <MessageInput
          textAreaValue={textAreaValue}
          onTextAreaChange={handleTextAreaChange}
          onKeyDown={handleKeyDown}
        />
      </main>
      {/* ПРАВА КОЛОНКА З ЮЗЕРАМИ */}
      <UserSidebar />
    </div>
  );
};

export default App;
