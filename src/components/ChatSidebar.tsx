import type { ChangeEvent, KeyboardEvent } from "react"
import type { Chat } from "../types"
import { NewChatModal } from "./NewChatModal"

type ChatSidebarProps = {
  chats: Chat[]
  activeChatId: string | null
  newChatFlag: boolean
  newChatName: string
  username: string
  onSelectChat: (id: string) => void
  onAddChat: () => void
  onCreateChat: () => void
  onCancelChat: () => void
  onNewChatNameChange: (event: ChangeEvent<HTMLInputElement>) => void
  onNewChatNameKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void
}

export const ChatSidebar = ({
  chats,
  activeChatId,
  newChatFlag,
  newChatName,
  username,
  onSelectChat,
  onAddChat,
  onCreateChat,
  onCancelChat,
  onNewChatNameChange,
  onNewChatNameKeyDown,
}: ChatSidebarProps) => (
  <aside className="w-60 shrink-0 border-r border-zinc-800 flex flex-col">
    <div className="px-4 py-3 border-b border-zinc-800 flex flex-col gap-2">
      <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
        Chats
      </h2>
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
          onClick={() => onSelectChat(chat.id)}
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
)
