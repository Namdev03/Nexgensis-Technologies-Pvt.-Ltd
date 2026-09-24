import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, ready, login, loggingIn } = useAuth();
  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");
  const [error, setError] = useState("");
  const lastClickRef = useRef(0);

  useEffect(() => {
    if (ready && user) {
      const next = searchParams.get("next");
      navigate(next || "/products", { replace: true });
    }
  }, [ready, user, navigate, searchParams]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Throttle: ignore submits that land within 500ms of the last one
    // (covers Enter+click double fires as well as button mashing).
    const now = Date.now();
    if (now - lastClickRef.current < 500) return;
    lastClickRef.current = now;

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    const res = await login(username.trim(), password);
    if (!res.ok && res.message) setError(res.message);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 text-center">
          <span className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-xl bg-brand-500 text-base font-bold text-white">
            P
          </span>
          <h1 className="text-lg font-semibold text-slate-900">Product Admin</h1>
          <p className="text-sm text-slate-500">Sign in to manage your catalog</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="focus-ring w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="focus-ring w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loggingIn}
            className="focus-ring w-full rounded-lg bg-brand-500 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-60"
          >
            {loggingIn ? "Signing in..." : "Log in"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-400">
          Demo credentials: <span className="font-mono">emilys</span> /{" "}
          <span className="font-mono">emilyspass</span>
        </p>
      </div>
    </div>
  );
}
