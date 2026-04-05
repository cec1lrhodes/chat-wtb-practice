import { useCallback, useRef } from "react";
import type {
  ChangeEvent,
  KeyboardEvent,
  Dispatch,
  SetStateAction,
} from "react";
import type { Socket } from "socket.io-client";

type Props = {
  socket: Socket | null;
  activeChatId: string | null;
  newChatName: string;
  textAreaValue: string;
  setActiveChatId: Dispatch<SetStateAction<string | null>>;
  setNewChatFlag: Dispatch<SetStateAction<boolean>>;
  setNewChatName: Dispatch<SetStateAction<string>>;
  setTextAreaValue: Dispatch<SetStateAction<string>>;
};

export const useChatSocketActions = ({
  socket,
  activeChatId,
  newChatName,
  textAreaValue,
  setActiveChatId,
  setNewChatFlag,
  setNewChatName,
  setTextAreaValue,
}: Props) => {
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSelectChat = useCallback(
    (id: string) => {
      setActiveChatId(id);
      socket?.emit("chat:join", { chatId: id });
    },
    [socket, setActiveChatId],
  );

  const handleAddChat = useCallback(
    () => setNewChatFlag(true),
    [setNewChatFlag],
  );

  const handleCancelChat = useCallback(() => {
    setNewChatFlag(false);
    setNewChatName("");
  }, [setNewChatFlag, setNewChatName]);

  const handleCreateChat = useCallback(() => {
    if (newChatName.trim() === "" || !socket) return;
    socket.emit("chat:create", { name: newChatName });
    setNewChatName("");
    setNewChatFlag(false);
  }, [newChatName, socket, setNewChatName, setNewChatFlag]);

  const handleNewChatNameChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setNewChatName(e.target.value);
    },
    [setNewChatName],
  );

  const handleNewChatNameKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") handleCreateChat();
      if (e.key === "Escape") handleCancelChat();
    },
    [handleCreateChat, handleCancelChat],
  );

  const handleSendMessage = useCallback(() => {
    if (textAreaValue.trim() === "" || !activeChatId || !socket) return;
    socket.emit("message:send", { chatId: activeChatId, text: textAreaValue });
    setTextAreaValue("");
  }, [textAreaValue, activeChatId, socket, setTextAreaValue]);

  const handleTextAreaChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setTextAreaValue(e.target.value);

      if (!socket || !activeChatId) return;

      socket.emit("typing:start", { chatId: activeChatId });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket?.emit("typing:stop", { chatId: activeChatId });
      }, 1500);
    },
    [activeChatId, socket, setTextAreaValue],
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
    handleSelectChat,
    handleAddChat,
    handleCancelChat,
    handleCreateChat,
    handleNewChatNameChange,
    handleNewChatNameKeyDown,
    handleTextAreaChange,
    handleKeyDown,
  };
};
