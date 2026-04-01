const MOCK_USERS = ["User 1", "User 2"];

export const UserSidebar = () => (
  <aside className="w-52 shrink-0 border-l border-zinc-800 flex flex-col">
    <div className="px-4 py-3 border-b border-zinc-800">
      <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
        Users
      </h2>
    </div>
    <ul
      className="flex-1 overflow-y-auto p-2 flex flex-col gap-1"
      aria-label="Online users"
    >
      {MOCK_USERS.map((user) => (
        <li
          key={user}
          className="px-3 py-2 rounded-lg text-sm text-zinc-300 flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
          {user}
        </li>
      ))}
    </ul>
  </aside>
);
