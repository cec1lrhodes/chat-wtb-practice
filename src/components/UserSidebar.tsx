import { memo } from "react";
import type { User } from "../types";

type UserSidebarProps = {
  onlineUsers: User[];
  totalUsers: number;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
};

export const UserSidebar = memo<UserSidebarProps>(
  ({ onlineUsers, totalUsers, isOpen, onClose, onLogout }) => {
    return (
      <aside
        className={`
          fixed inset-y-0 right-0 z-40 w-64 flex flex-col bg-zinc-950 border-l border-zinc-800
          transform transition-transform duration-300 ease-in-out
          md:relative md:inset-auto md:z-auto md:w-52 md:shrink-0 md:translate-x-0
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="px-4 py-3 border-b border-zinc-800 flex items-start justify-between">
          <div>
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
              Users
            </h2>
            <p className="text-xs text-zinc-600 mt-1">
              {onlineUsers.length} online · {totalUsers} total
            </p>
          </div>
          <button
            onClick={onClose}
            className="md:hidden p-1 rounded text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors shrink-0"
            aria-label="Закрити"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <ul className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
          {onlineUsers.map((user) => (
            <li
              key={user.id}
              className="px-3 py-2 rounded-lg text-sm text-zinc-300 flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
              {user.username}
            </li>
          ))}
        </ul>

        <div className="px-4 py-3 border-t border-zinc-800">
          <button
            onClick={onLogout}
            className="w-full text-sm text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-lg px-3 py-2 transition-colors text-left"
          >
            Log out
          </button>
        </div>
      </aside>
    );
  },
);
