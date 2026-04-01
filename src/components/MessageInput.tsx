import React from "react";

type MessageInputProps = {
  textAreaValue: string;
  onTextAreaChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
};

export const MessageInput = ({
  textAreaValue,
  onTextAreaChange,
  onKeyDown,
}: MessageInputProps) => (
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
