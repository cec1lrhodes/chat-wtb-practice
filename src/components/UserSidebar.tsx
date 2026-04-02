import type { User } from "../types";

type UserSidebarProps = {
  onlineUsers: User[];
  totalUsers: number;
  onLogout: () => void;
};

export const UserSidebar = ({
  onlineUsers,
  totalUsers,
  onLogout,
}: UserSidebarProps) => (
  <aside className="w-52 shrink-0 border-l border-zinc-800 flex flex-col">
    <div className="px-4 py-3 border-b border-zinc-800">
      <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
        Users
      </h2>
      <p className="text-xs text-zinc-600 mt-1">
        {onlineUsers.length} online · {totalUsers} total
      </p>
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
