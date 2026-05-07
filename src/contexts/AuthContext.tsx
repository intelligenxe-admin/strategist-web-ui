"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { AuthUser } from "@/types";
import { loginUser, registerUser } from "@/services/api";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = window.localStorage.getItem("auth");
    if (!stored) return null;
    try {
      return JSON.parse(stored) as AuthUser;
    } catch {
      window.localStorage.removeItem("auth");
      return null;
    }
  });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot client-detect to suppress SSR/CSR mismatch
    setHydrated(true);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const authUser = await loginUser(username, password);
    localStorage.setItem("auth", JSON.stringify(authUser));
    setUser(authUser);
  }, []);

  const register = useCallback(
    async (
      username: string,
      password: string,
      email: string,
      firstName: string,
      lastName: string
    ) => {
      const authUser = await registerUser(username, password, email, firstName, lastName);
      localStorage.setItem("auth", JSON.stringify(authUser));
      setUser(authUser);
    },
    []
  );

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
