import { memo, type ChangeEvent, type KeyboardEvent } from "react";

type MessageInputProps = {
  textAreaValue: string;
  onTextAreaChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
};

export const MessageInput = memo<MessageInputProps>(
  ({ textAreaValue, onTextAreaChange, onKeyDown }) => {
    console.log("MessageInput render");
    return (
      <div className="p-4 border-t border-zinc-800">
        <textarea
          value={textAreaValue}
          onChange={onTextAreaChange}
          onKeyDown={onKeyDown}
          rows={3}
          placeholder="Type your message..."
          className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 resize-none focus:outline-none focus:ring-2 focus:ring-zinc-600 transition"
        />
      </div>
    );
  },
);
