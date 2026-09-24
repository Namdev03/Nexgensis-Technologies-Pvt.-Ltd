
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    user,
    ready,
    login,
    loggingIn,
  } = useAuth();

  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const lastClickRef = useRef(0);

  // Redirect authenticated users
  useEffect(() => {
    if (ready && user) {
      const next = searchParams.get("next");
      navigate(next || "/products", { replace: true });
    }
  }, [ready, user, navigate, searchParams]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Prevent rapid/double submissions
    const now = Date.now();

    if (now - lastClickRef.current < 500) {
      return;
    }

    lastClickRef.current = now;

    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    if (!cleanUsername || !cleanPassword) {
      setError("Please enter both username and password.");
      return;
    }

    try {
      const res = await login(cleanUsername, cleanPassword);

      if (!res?.ok && res?.message) {
        setError(res.message);
      }
    } catch (error) {
      setError(
        error?.message || "Something went wrong. Please try again."
      );
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-brand-500/10 blur-3xl" />

        <div className="absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-brand-500/10 blur-3xl" />
      </div>

      {/* Login container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo / Brand */}
        <div className="mb-6 text-center sm:mb-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500 text-xl font-bold text-white shadow-lg shadow-brand-500/25">
            A
          </div>

          <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Admin Dashboard
          </h1>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500 sm:text-base">
            Sign in to manage your products
          </p>
        </div>

        {/* Login card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-5 p-5 sm:p-7 md:p-8"
          >
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Username
              </label>

              <div className="relative">
                {/* User icon */}
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"
                    />
                  </svg>
                </div>

                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  autoComplete="username"
                  autoFocus
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Password
              </label>

              <div className="relative">
                {/* Lock icon */}
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V7.875a4.5 4.5 0 0 0-9 0V10.5m-.75 0h10.5A1.5 1.5 0 0 1 18.75 12v7.125a1.5 1.5 0 0 1-1.5 1.5H6.75a1.5 1.5 0 0 1-1.5-1.5V12a1.5 1.5 0 0 1 1.5-1.5Z"
                    />
                  </svg>
                </div>

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
                />

                {/* Show / Hide password */}
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400 transition hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 0 0 2.25 12c1.5 4.5 5.25 7.5 9.75 7.5 1.61 0 3.11-.39 4.44-1.08M6.228 6.228A9.982 9.982 0 0 1 12 4.5c4.5 0 8.25 3 9.75 7.5a10.56 10.56 0 0 1-2.35 3.85M3 3l18 18"
                      />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12Z"
                      />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="mt-0.5 h-5 w-5 shrink-0"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path
                    strokeLinecap="round"
                    d="M12 8v4M12 16h.01"
                  />
                </svg>

                <p>{error}</p>
              </div>
            )}

            {/* Login button */}
            <button
              type="submit"
              disabled={loggingIn}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 transition duration-200 hover:bg-brand-600 hover:shadow-brand-500/30 focus:outline-none focus:ring-4 focus:ring-brand-500/20 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loggingIn && (
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />

                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4Z"
                  />
                </svg>
              )}

              {loggingIn ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="border-t border-slate-100 bg-slate-50 px-5 py-4 sm:px-8">
            <p className="text-center text-xs font-medium text-slate-500">
              Demo credentials
            </p>

            <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
              <code className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 font-mono text-slate-700">
                emilys
              </code>

              <span className="text-slate-400">/</span>

              <code className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 font-mono text-slate-700">
                emilyspass
              </code>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-400">
          Secure Admin Portal · Product Management
        </p>
      </div>
    </main>
  );
}

