import { useState, useEffect, useRef } from "react"
import { io, Socket } from "socket.io-client"
import type { Chat, User, Message } from "../types"

const SOCKET_URL = "http://localhost:3001"

// Server uses chatId/messageId/userId — map to frontend's id field
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapChat = (c: any): Chat => ({
  id: c.chatId,
  name: c.name,
  messages: (c.messages ?? []).map(mapMessage),
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapMessage = (m: any): Message => ({
  id: m.messageId,
  userId: m.userId,
  username: m.username,
  text: m.text,
  createdAt: m.createdAt,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapUser = (u: any): User => ({
  id: u.userId,
  username: u.username,
})

export const useSocket = (token: string) => {
  const socketRef = useRef<Socket | null>(null)
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [chats, setChats] = useState<Chat[]>([])
  const [onlineUsers, setOnlineUsers] = useState<User[]>([])
  const [totalUsers, setTotalUsers] = useState(0)
  const [typingUsers, setTypingUsers] = useState<Record<string, string[]>>({})
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [newChatFlag, setNewChatFlag] = useState(false)
  const [newChatName, setNewChatName] = useState("")
  const [textAreaValue, setTextAreaValue] = useState("")

  const activeChat = chats.find((c) => c.id === activeChatId)

  useEffect(() => {
    const socket = io(SOCKET_URL, { auth: { token } })
    socketRef.current = socket

    socket.on("init", (data: { chats: unknown[]; onlineUsers: unknown[]; totalUsers: number }) => {
      setChats(data.chats.map(mapChat))
      setOnlineUsers(data.onlineUsers.map(mapUser))
      setTotalUsers(data.totalUsers)
    })

    socket.on("chat:created", (chat: unknown) => {
      setChats((prev) => [...prev, mapChat(chat)])
    })

    socket.on("message:new", (msg: { messageId: string; chatId: string; userId: string; username: string; text: string; createdAt: string }) => {
      const message = mapMessage(msg)
      setChats((prev) =>
        prev.map((c) =>
          c.id === msg.chatId
            ? { ...c, messages: [...c.messages, message] }
            : c
        )
      )
    })

    socket.on("users:online", (users: unknown[]) => {
      setOnlineUsers(users.map(mapUser))
    })

    socket.on("typing:update", (payload: { chatId: string; usernames: string[] }) => {
      setTypingUsers((prev) => ({ ...prev, [payload.chatId]: payload.usernames }))
    })

    return () => {
      socket.disconnect()
    }
  }, [token])

  const handleSelectChat = (id: string) => {
    setActiveChatId(id)
    socketRef.current?.emit("chat:join", { chatId: id })
  }

  const handleAddChat = () => setNewChatFlag(true)

  const handleCancelChat = () => {
    setNewChatFlag(false)
    setNewChatName("")
  }

  const handleCreateChat = () => {
    if (newChatName.trim() === "" || !socketRef.current) return
    socketRef.current.emit("chat:create", { name: newChatName })
    setNewChatName("")
    setNewChatFlag(false)
  }

  const handleNewChatNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewChatName(e.target.value)
  }

  const handleNewChatNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleCreateChat()
    if (e.key === "Escape") handleCancelChat()
  }

  const handleSendMessage = () => {
    if (textAreaValue.trim() === "" || !activeChatId || !socketRef.current) return
    socketRef.current.emit("message:send", { chatId: activeChatId, text: textAreaValue })
    setTextAreaValue("")
  }

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextAreaValue(e.target.value)

    if (!socketRef.current || !activeChatId) return

    socketRef.current.emit("typing:start", { chatId: activeChatId })

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit("typing:stop", { chatId: activeChatId })
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return {
    chats,
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
  }
}
