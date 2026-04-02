import type { ChangeEvent, KeyboardEvent } from "react";

type NewChatModalProps = {
  newChatName: string;
  onConfirm: () => void;
  onCancel: () => void;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
};

export const NewChatModal = ({
  newChatName,
  onConfirm,
  onCancel,
  onChange,
  onKeyDown,
}: NewChatModalProps) => (
  <div
    className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
    role="dialog"
  >
    <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-80 flex flex-col gap-4">
      <h3
        id="new-chat-title"
        className="text-sm font-semibold text-zinc-300 uppercase tracking-wider"
      >
        Створити новий чат
      </h3>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-zinc-500 font-mono">
          введіть назву чату
        </label>
        <input
          value={newChatName}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder="new chat"
          className="bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500"
          autoFocus
        />
      </div>
      <div className="flex justify-between gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-2 rounded-lg border border-red-600 text-red-500 text-sm hover:bg-red-600/10 transition-colors"
        >
          Скасувати
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-2 rounded-lg border border-green-600 text-green-500 text-sm hover:bg-green-600/10 transition-colors"
        >
          Створити
        </button>
      </div>
    </div>
  </div>
);
