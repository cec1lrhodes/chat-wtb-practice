import { useState } from "react"
import type { Chat } from "../types"

export const useChats = () => {
  const [chats, setChats] = useState<Chat[]>([])
  const [activeChatId, setActiveChatId] = useState<number | null>(null)
  const [newChatName, setNewChatName] = useState("")
  const [newChatFlag, setNewChatFlag] = useState(false)

  const activeChat = chats.find((chat) => chat.id === activeChatId)

  const handleSelectChat = (id: number) => {
    setActiveChatId(id)
  }

  const handleAddChat = () => {
    setNewChatFlag(true)
  }

  const handleCreateChat = () => {
    if (newChatName.trim() === "") return
    const newChat: Chat = { id: Date.now(), name: newChatName, messages: [] }
    setChats([...chats, newChat])
    setActiveChatId(newChat.id)
    setNewChatName("")
    setNewChatFlag(false)
  }

  const handleCancelChat = () => {
    setNewChatName("")
    setNewChatFlag(false)
  }

  const handleNewChatNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewChatName(event.target.value)
  }

  const handleNewChatNameKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter") handleCreateChat()
    if (event.key === "Escape") handleCancelChat()
  }

  return {
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
  }
}
