import { useState } from "react";

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token"),
  );
  const [username, setUsername] = useState<string>(
    () => localStorage.getItem("username") ?? "",
  );

  const handleAuth = (newToken: string, newUsername: string) => {
    setToken(newToken);
    setUsername(newUsername);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setToken(null);
    setUsername("");
  };

  return { token, username, handleAuth, handleLogout };
};
