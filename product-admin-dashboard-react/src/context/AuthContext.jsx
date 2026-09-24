import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginRequest } from "@/lib/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false); // becomes true once we've checked localStorage
  const [loggingIn, setLoggingIn] = useState(false);
  const inFlight = useRef(false); // guards against double-submit from fast repeated clicks
  const navigate = useNavigate();

  useEffect(() => {
    const token = window.localStorage.getItem("pad_token");
    const storedUser = window.localStorage.getItem("pad_user");
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        // ignore malformed cache
      }
    }
    setReady(true);
  }, []);

  const login = useCallback(async (username, password) => {
    // If a login request is already in flight, ignore extra clicks/submits.
    if (inFlight.current) return { ok: false, message: null };
    inFlight.current = true;
    setLoggingIn(true);
    try {
      const data = await loginRequest({ username, password });
      window.localStorage.setItem("pad_token", data.accessToken || data.token);
      window.localStorage.setItem(
        "pad_user",
        JSON.stringify({
          id: data.id,
          username: data.username,
          firstName: data.firstName,
          lastName: data.lastName,
          image: data.image,
        })
      );
      setUser({
        id: data.id,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        image: data.image,
      });
      return { ok: true };
    } catch (err) {
      return { ok: false, message: err.message || "Login failed. Please try again." };
    } finally {
      inFlight.current = false;
      setLoggingIn(false);
    }
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem("pad_token");
    window.localStorage.removeItem("pad_user");
    setUser(null);
    navigate("/login");
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, ready, loggingIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
