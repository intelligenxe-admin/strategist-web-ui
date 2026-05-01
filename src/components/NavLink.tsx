"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export default function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`text-sm font-bold transition-colors ${
        isActive
          ? "text-blue-600"
          : "text-[#020266] hover:text-[#020266]/80"
      }`}
    >
      {children}
    </Link>
  );
}
