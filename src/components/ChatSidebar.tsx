import { memo, type ChangeEvent, type KeyboardEvent } from "react";
import type { ChatItem } from "../types";
import { NewChatModal } from "./NewChatModal";

type ChatSidebarProps = {
  chats: ChatItem[];
  activeChatId: string | null;
  newChatFlag: boolean;
  newChatName: string;
  username: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectChat: (id: string) => void;
  onAddChat: () => void;
  onCreateChat: () => void;
  onCancelChat: () => void;
  onNewChatNameChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onNewChatNameKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
};

export const ChatSidebar = memo<ChatSidebarProps>(
  ({
    chats,
    activeChatId,
    newChatFlag,
    newChatName,
    username,
    isOpen,
    onClose,
    onSelectChat,
    onAddChat,
    onCreateChat,
    onCancelChat,
    onNewChatNameChange,
    onNewChatNameKeyDown,
  }) => {
    const handleSelectAndClose = (id: string) => {
      onSelectChat(id)
      onClose()
    }

    return (
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-72 flex flex-col bg-zinc-950 border-r border-zinc-800
          transform transition-transform duration-300 ease-in-out
          md:relative md:inset-auto md:z-auto md:w-60 md:shrink-0 md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="px-4 py-3 border-b border-zinc-800 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
              Chats
            </h2>
            <button
              onClick={onClose}
              className="md:hidden p-1 rounded text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
              aria-label="Закрити"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <button
            onClick={onAddChat}
            className="text-zinc-400 hover:text-zinc-300 bg-zinc-800 rounded-lg px-4 py-2 text-sm transition-colors"
          >
            Add new chat
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => handleSelectAndClose(chat.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                chat.id === activeChatId
                  ? "bg-zinc-700 text-white"
                  : "text-zinc-300 hover:bg-zinc-800"
              }`}
            >
              # {chat.name}
            </button>
          ))}
        </nav>

        {newChatFlag && (
          <NewChatModal
            newChatName={newChatName}
            onConfirm={onCreateChat}
            onCancel={onCancelChat}
            onChange={onNewChatNameChange}
            onKeyDown={onNewChatNameKeyDown}
          />
        )}

        <div className="px-4 py-3 border-t border-zinc-800 flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold shrink-0 uppercase">
            {username[0] ?? "?"}
          </div>
          <span className="text-sm text-zinc-300 truncate">{username}</span>
        </div>
      </aside>
    );
  },
);
