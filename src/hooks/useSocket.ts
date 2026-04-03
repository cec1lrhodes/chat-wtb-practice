import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { io, Socket } from "socket.io-client";
import type { ChangeEvent, KeyboardEvent } from "react";
import type { Chat, ChatItem, User, Message } from "../types";

const SOCKET_URL = "http://localhost:3001";

// Server uses chatId/messageId/userId — map to frontend's id field
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapChat = (c: any): Chat => ({
  id: c.chatId,
  name: c.name,
  messages: (c.messages ?? []).map(mapMessage),
  createdAt: c.createdAt,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapMessage = (m: any): Message => ({
  id: m.messageId,
  userId: m.userId,
  username: m.username,
  text: m.text,
  createdAt: m.createdAt,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapUser = (u: any): User => ({
  id: u.userId,
  username: u.username,
});

export const useSocket = (token: string) => {
  const socketRef = useRef<Socket | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  useEffect(() => {
    const socket = io(SOCKET_URL, { auth: { token } });
    socketRef.current = socket;

    socket.on(
      "init",
      (data: {
        chats: unknown[];
        onlineUsers: unknown[];
        totalUsers: number;
      }) => {
        const mappedChats = data.chats.map(mapChat)
        setChats(mappedChats);
        setChatList(mappedChats.map(({ id, name }) => ({ id, name })));
        setOnlineUsers(data.onlineUsers.map(mapUser));
        setTotalUsers(data.totalUsers);
      },
    );

    socket.on("chat:created", (chat: unknown) => {
      const mapped = mapChat(chat);
      setChats((prev) => [...prev, mapped]);
      setChatList((prev) => [...prev, { id: mapped.id, name: mapped.name }]);
    });

    socket.on(
      "message:new",
      (msg: {
        messageId: string;
        chatId: string;
        userId: string;
        username: string;
        text: string;
        createdAt: string;
      }) => {
        const message = mapMessage(msg);
        setChats((prev) =>
          prev.map((c) =>
            c.id === msg.chatId
              ? { ...c, messages: [...c.messages, message] }
              : c,
          ),
        );
      },
    );

    socket.on("users:online", (users: unknown[]) => {
      setOnlineUsers(users.map(mapUser));
    });

    const currentUsername = localStorage.getItem("username") ?? "";

    socket.on(
      "typing:update",
      (payload: { chatId: string; usernames: string[] }) => {
        const others = payload.usernames.filter(
          (name) => name !== currentUsername,
        );
        setTypingUsers((prev) => ({ ...prev, [payload.chatId]: others }));
      },
    );

    return () => {
      socket.disconnect();
    };
  }, [token]);

  const handleSelectChat = useCallback((id: string) => {
    setActiveChatId(id);
    socketRef.current?.emit("chat:join", { chatId: id });
  }, []);

  const handleAddChat = useCallback(() => setNewChatFlag(true), []);

  const handleCancelChat = useCallback(() => {
    setNewChatFlag(false);
    setNewChatName("");
  }, []);

  const handleCreateChat = useCallback(() => {
    if (newChatName.trim() === "" || !socketRef.current) return;
    socketRef.current.emit("chat:create", { name: newChatName });
    setNewChatName("");
    setNewChatFlag(false);
  }, [newChatName]);

  const handleNewChatNameChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setNewChatName(e.target.value);
    },
    [],
  );

  const handleNewChatNameKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") handleCreateChat();
      if (e.key === "Escape") handleCancelChat();
    },
    [handleCreateChat, handleCancelChat],
  );

  const handleSendMessage = useCallback(() => {
    if (textAreaValue.trim() === "" || !activeChatId || !socketRef.current)
      return;
    socketRef.current.emit("message:send", {
      chatId: activeChatId,
      text: textAreaValue,
    });
    setTextAreaValue("");
  }, [textAreaValue, activeChatId]);

  const handleTextAreaChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setTextAreaValue(e.target.value);

      if (!socketRef.current || !activeChatId) return;

      socketRef.current.emit("typing:start", { chatId: activeChatId });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socketRef.current?.emit("typing:stop", { chatId: activeChatId });
      }, 1500);
    },
    [activeChatId],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage],
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
    handleSelectChat,
    handleAddChat,
    handleCreateChat,
    handleCancelChat,
    handleNewChatNameChange,
    handleNewChatNameKeyDown,
    handleTextAreaChange,
    handleKeyDown,
  };
};
