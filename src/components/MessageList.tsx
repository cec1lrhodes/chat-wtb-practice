import type { Chat } from "../types";

type MessageListProps = {
  activeChat: Chat | undefined;
};

export const MessageList = ({ activeChat }: MessageListProps) => (
  <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2" role="log">
    {activeChat ? (
      activeChat.messages.map((message, index) => (
        <div
          key={index}
          className="text-sm text-zinc-300 bg-zinc-800 rounded-lg p-2"
        >
          {message}
        </div>
      ))
    ) : (
      <p className="text-zinc-600 text-sm text-center mt-10">Виберіть чат</p>
    )}
  </div>
);
