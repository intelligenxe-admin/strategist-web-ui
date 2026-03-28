"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { AuthUser } from "@/types";
import { loginUser, registerUser } from "@/services/api";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, email: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("auth");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("auth");
      }
    }
    setHydrated(true);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const authUser = await loginUser(username, password);
    localStorage.setItem("auth", JSON.stringify(authUser));
    setUser(authUser);
  }, []);

  const register = useCallback(async (username: string, password: string, email: string) => {
    const authUser = await registerUser(username, password, email);
    localStorage.setItem("auth", JSON.stringify(authUser));
    setUser(authUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("auth");
    setUser(null);
    window.location.href = "/login";
  }, []);

  if (!hydrated) return null;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
