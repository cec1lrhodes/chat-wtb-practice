import { useState } from "react"
import type { Chat } from "../types"

export const useMessageInput = (
  activeChatId: number | null,
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>,
) => {
  const [textAreaValue, setTextAreaValue] = useState("")

  const handleSendMessage = () => {
    if (textAreaValue.trim() === "" || activeChatId === null) return
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChatId
          ? { ...chat, messages: [...chat.messages, textAreaValue] }
          : chat,
      ),
    )
    setTextAreaValue("")
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") handleSendMessage()
  }

  const handleTextAreaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setTextAreaValue(event.target.value)
  }

  return {
    textAreaValue,
    handleSendMessage,
    handleKeyDown,
    handleTextAreaChange,
  }
}
