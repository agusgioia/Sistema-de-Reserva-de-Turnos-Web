import { useState } from "react";
import { AuthContext, STORAGE_KEY } from "./auth-context";

function readStoredSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persistSession(session) {
  if (!session) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => readStoredSession());

  const login = ({ token, user, tenant }) => {
    const next = {
      token: token || "demo-token",
      user,
      tenant: tenant || { id: user?.negocioId || 1, nombre: "Negocio" },
    };
    setSession(next);
    persistSession(next);
  };

  const logout = () => {
    setSession(null);
    persistSession(null);
  };

  const value = {
    session,
    isAuthenticated: Boolean(session?.token),
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
