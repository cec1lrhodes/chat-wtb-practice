import { useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Socket } from "socket.io-client";
import type { User } from "../../../types";
import { mapUser } from "../socketMappers";

type TypingPayload = {
  chatId: string;
  usernames: string[];
};

type Props = {
  socket: Socket | null;
  currentUsername: string;
  setOnlineUsers: Dispatch<SetStateAction<User[]>>;
  setTypingUsers: Dispatch<SetStateAction<Record<string, string[]>>>;
};

export const useSocketPresenceListeners = ({
  socket,
  currentUsername,
  setOnlineUsers,
  setTypingUsers,
}: Props) => {
  useEffect(() => {
    if (!socket) return;

    const handleUsersOnline = (users: unknown[]) => {
      setOnlineUsers(users.map(mapUser));
    };

    const handleTypingUpdate = (payload: TypingPayload) => {
      const others = payload.usernames.filter(
        (name) => name !== currentUsername,
      );
      setTypingUsers((prev) => ({ ...prev, [payload.chatId]: others }));
    };

    socket.on("users:online", handleUsersOnline);
    socket.on("typing:update", handleTypingUpdate);

    return () => {
      socket.off("users:online", handleUsersOnline);
      socket.off("typing:update", handleTypingUpdate);
    };
  }, [socket, currentUsername, setOnlineUsers, setTypingUsers]);
};
