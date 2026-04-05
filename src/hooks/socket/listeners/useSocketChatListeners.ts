import { useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Socket } from "socket.io-client";
import type { Chat, ChatItem } from "../../../types";
import { mapChat, mapMessage } from "../socketMappers";

type NewMessagePayload = {
  messageId: string;
  chatId: string;
  userId: string;
  username: string;
  text: string;
  createdAt: string;
};

type Props = {
  socket: Socket | null;
  setChats: Dispatch<SetStateAction<Chat[]>>;
  setChatList: Dispatch<SetStateAction<ChatItem[]>>;
};

export const useSocketChatListeners = ({
  socket,
  setChats,
  setChatList,
}: Props) => {
  useEffect(() => {
    if (!socket) return;

    const handleChatCreated = (chat: unknown) => {
      const mapped = mapChat(chat);
      setChats((prev) => [...prev, mapped]);
      setChatList((prev) => [...prev, { id: mapped.id, name: mapped.name }]);
    };

    const handleMessageNew = (msg: NewMessagePayload) => {
      const message = mapMessage(msg);
      setChats((prev) =>
        prev.map((c) =>
          c.id === msg.chatId
            ? { ...c, messages: [...c.messages, message] }
            : c,
        ),
      );
    };

    socket.on("chat:created", handleChatCreated);
    socket.on("message:new", handleMessageNew);

    return () => {
      socket.off("chat:created", handleChatCreated);
      socket.off("message:new", handleMessageNew);
    };
  }, [socket, setChats, setChatList]);
};
