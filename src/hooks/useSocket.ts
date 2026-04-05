import { useChatSocketState } from "./socket/useChatSocketState";
import { useSocketInstance } from "./socket/useSocketInstance";
import { useSocketInitListener } from "./socket/listeners/useSocketInitListener";
import { useSocketChatListeners } from "./socket/listeners/useSocketChatListeners";
import { useSocketPresenceListeners } from "./socket/listeners/useSocketPresenceListeners";
import { useChatSocketActions } from "./socket/useChatSocketActions";

export const useSocket = (token: string) => {
  const state = useChatSocketState();
  const socket = useSocketInstance(token);
  const currentUsername = localStorage.getItem("username") ?? "";

  useSocketInitListener({
    socket,
    setChats: state.setChats,
    setChatList: state.setChatList,
    setOnlineUsers: state.setOnlineUsers,
    setTotalUsers: state.setTotalUsers,
  });

  useSocketChatListeners({
    socket,
    setChats: state.setChats,
    setChatList: state.setChatList,
  });

  useSocketPresenceListeners({
    socket,
    currentUsername,
    setOnlineUsers: state.setOnlineUsers,
    setTypingUsers: state.setTypingUsers,
  });

  const actions = useChatSocketActions({
    socket,
    activeChatId: state.activeChatId,
    newChatName: state.newChatName,
    textAreaValue: state.textAreaValue,
    setActiveChatId: state.setActiveChatId,
    setNewChatFlag: state.setNewChatFlag,
    setNewChatName: state.setNewChatName,
    setTextAreaValue: state.setTextAreaValue,
  });

  return {
    chats: state.chats,
    chatList: state.chatList,
    onlineUsers: state.onlineUsers,
    totalUsers: state.totalUsers,
    typingUsers: state.typingUsers,
    activeChatId: state.activeChatId,
    activeChat: state.activeChat,
    newChatFlag: state.newChatFlag,
    newChatName: state.newChatName,
    textAreaValue: state.textAreaValue,
    handleSelectChat: actions.handleSelectChat,
    handleAddChat: actions.handleAddChat,
    handleCreateChat: actions.handleCreateChat,
    handleCancelChat: actions.handleCancelChat,
    handleNewChatNameChange: actions.handleNewChatNameChange,
    handleNewChatNameKeyDown: actions.handleNewChatNameKeyDown,
    handleTextAreaChange: actions.handleTextAreaChange,
    handleKeyDown: actions.handleKeyDown,
  };
};
