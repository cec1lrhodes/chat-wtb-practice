import { useState, useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Chat, ChatItem, User } from "../../types";

export type ChatSocketState = {
  chats: Chat[];
  chatList: ChatItem[];
  onlineUsers: User[];
  totalUsers: number;
  typingUsers: Record<string, string[]>;
  activeChatId: string | null;
  activeChat: Chat | undefined;
  newChatFlag: boolean;
  newChatName: string;
  textAreaValue: string;
  setChats: Dispatch<SetStateAction<Chat[]>>;
  setChatList: Dispatch<SetStateAction<ChatItem[]>>;
  setOnlineUsers: Dispatch<SetStateAction<User[]>>;
  setTotalUsers: Dispatch<SetStateAction<number>>;
  setTypingUsers: Dispatch<SetStateAction<Record<string, string[]>>>;
  setActiveChatId: Dispatch<SetStateAction<string | null>>;
  setNewChatFlag: Dispatch<SetStateAction<boolean>>;
  setNewChatName: Dispatch<SetStateAction<string>>;
  setTextAreaValue: Dispatch<SetStateAction<string>>;
};

export const useChatSocketState = (): ChatSocketState => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [chatList, setChatList] = useState<ChatItem[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [typingUsers, setTypingUsers] = useState<Record<string, string[]>>({});
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [newChatFlag, setNewChatFlag] = useState(false);
  const [newChatName, setNewChatName] = useState("");
  const [textAreaValue, setTextAreaValue] = useState("");

  const activeChat = useMemo(
    () => chats.find((c) => c.id === activeChatId),
    [chats, activeChatId],
  );

  return {
    chats,
    chatList,
    onlineUsers,
    totalUsers,
    typingUsers,
    activeChatId,
    activeChat,
    newChatFlag,
    newChatName,
    textAreaValue,
    setChats,
    setChatList,
    setOnlineUsers,
    setTotalUsers,
    setTypingUsers,
    setActiveChatId,
    setNewChatFlag,
    setNewChatName,
    setTextAreaValue,
  };
};
