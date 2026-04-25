import Link from "next/link";
import NavLink from "./NavLink";
import NavAuth from "./NavAuth";
import NavWorkflowLinks from "./NavWorkflowLinks";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="" className="h-8 w-8" />
          <span className="font-semibold text-lg text-gray-900">Strategist</span>
        </Link>
        <a
          href="https://intelligenxe.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/intelligenxe-wordmark.jpg"
            alt="Intelligenxe"
            className="h-8 w-auto"
          />
        </a>
      </div>
      <div className="flex items-center gap-6">
        <NavLink href="/">Home</NavLink>
        <NavWorkflowLinks />
        <NavLink href="/rag">Knowledge</NavLink>
        <NavLink href="/about">About</NavLink>
        <NavAuth />
      </div>
    </nav>
  );
}
