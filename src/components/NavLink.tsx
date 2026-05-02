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
      className={`relative text-sm font-medium transition-colors ${
        isActive
          ? "text-brand after:absolute after:left-0 after:right-0 after:-bottom-[18px] after:h-[2px] after:bg-brand"
          : "text-gray-700 hover:text-brand"
      }`}
    >
      {children}
    </Link>
  );
}
