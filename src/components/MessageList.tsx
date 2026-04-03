import { memo } from "react";
import type { Chat } from "../types";

type MessageListProps = {
  activeChat: Chat | undefined;
  typingUsers: string[];
};

export const MessageList = memo<MessageListProps>(
  ({ activeChat, typingUsers }) => {
    console.log("MessageList render");
    return (
      <div
        className="flex-1 overflow-y-auto p-4 flex flex-col gap-2"
        role="log"
      >
        {activeChat ? (
          <>
            {activeChat.messages.map((message) => (
              <div
                key={message.id}
                className="text-sm text-zinc-300 bg-zinc-800 rounded-lg px-3 py-2"
              >
                <span className="font-semibold text-zinc-100 mr-1">
                  {message.username}
                </span>
                <span className="text-zinc-600 mr-2">·</span>
                {message.text}
              </div>
            ))}

            {typingUsers.length > 0 && (
              <p className="text-xs text-zinc-500 italic px-1">
                {typingUsers.join(", ")}{" "}
                {typingUsers.length === 1 ? "is" : "are"} typing...
              </p>
            )}
          </>
        ) : (
          <p className="text-zinc-600 text-sm text-center mt-10">
            Виберіть чат
          </p>
        )}
      </div>
    );
  },
);
