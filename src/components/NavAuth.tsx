"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function NavAuth() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <Link
        href="/login"
        className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
      >
        Log In
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-600">{user?.username}</span>
      <button
        type="button"
        onClick={logout}
        className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
      >
        Log Out
      </button>
    </div>
  );
}
