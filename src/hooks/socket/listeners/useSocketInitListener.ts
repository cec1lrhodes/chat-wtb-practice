import { useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Socket } from "socket.io-client";
import type { Chat, ChatItem, User } from "../../../types";
import { mapChat, mapUser } from "../socketMappers";

type InitPayload = {
  chats: unknown[];
  onlineUsers: unknown[];
  totalUsers: number;
};

type Props = {
  socket: Socket | null;
  setChats: Dispatch<SetStateAction<Chat[]>>;
  setChatList: Dispatch<SetStateAction<ChatItem[]>>;
  setOnlineUsers: Dispatch<SetStateAction<User[]>>;
  setTotalUsers: Dispatch<SetStateAction<number>>;
};

export const useSocketInitListener = ({
  socket,
  setChats,
  setChatList,
  setOnlineUsers,
  setTotalUsers,
}: Props) => {
  useEffect(() => {
    if (!socket) return;

    const handleInit = (data: InitPayload) => {
      const mappedChats = data.chats.map(mapChat);
      setChats(mappedChats);
      setChatList(mappedChats.map(({ id, name }) => ({ id, name })));
      setOnlineUsers(data.onlineUsers.map(mapUser));
      setTotalUsers(data.totalUsers);
    };

    socket.on("init", handleInit);

    return () => {
      socket.off("init", handleInit);
    };
  }, [socket, setChats, setChatList, setOnlineUsers, setTotalUsers]);
};
