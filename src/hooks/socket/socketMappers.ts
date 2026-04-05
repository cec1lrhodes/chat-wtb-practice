import type { Chat, Message, User } from "../../types";

export const SOCKET_URL = "http://localhost:3001";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapMessage = (m: any): Message => ({
  id: m.messageId,
  userId: m.userId,
  username: m.username,
  text: m.text,
  createdAt: m.createdAt,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapChat = (c: any): Chat => ({
  id: c.chatId,
  name: c.name,
  messages: (c.messages ?? []).map(mapMessage),
  createdAt: c.createdAt,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapUser = (u: any): User => ({
  id: u.userId,
  username: u.username,
});
