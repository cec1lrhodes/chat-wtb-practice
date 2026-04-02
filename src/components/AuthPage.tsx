import { useState, type FormEvent } from "react";

type AuthMode = "login" | "register";

type AuthPageProps = {
  onAuth: (token: string, username: string) => void;
};

export const AuthPage = ({ onAuth }: AuthPageProps) => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      onAuth(data.token, data.username);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMode = () => {
    setMode((prev) => (prev === "login" ? "register" : "login"));
    setError(null);
  };

  return (
    <div className="flex h-screen bg-zinc-950 items-center justify-center">
      <div className="w-full max-w-sm bg-zinc-900 rounded-2xl p-8 border border-zinc-800 flex flex-col gap-6">
        <h1 className="text-xl font-bold text-white text-center">
          {mode === "login" ? "Sign in" : "Create account"}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
            className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600 transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
            required
            className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600 transition"
          />

          {error && (
            <p role="alert" className="text-red-400 text-sm">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50 text-white rounded-xl px-4 py-3 text-sm font-semibold transition-colors"
          >
            {loading ? "Loading..." : mode === "login" ? "Sign in" : "Register"}
          </button>
        </form>

        <button
          onClick={handleToggleMode}
          tabIndex={0}
          className="text-zinc-500 hover:text-zinc-300 text-sm text-center transition-colors"
        >
          {mode === "login"
            ? "No account? Register"
            : "Have an account? Sign in"}
        </button>
      </div>
    </div>
  );
};
