import Image from "next/image";
import Link from "next/link";
import NavLink from "./NavLink";
import NavAuth from "./NavAuth";
import NavWorkflowLinks from "./NavWorkflowLinks";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 flex h-14 items-center justify-between px-6 bg-white/80 backdrop-blur border-b border-gray-200/80">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="" width={32} height={32} className="h-8 w-8" />
          <span className="font-semibold text-lg text-gray-900">Strategist</span>
        </Link>
        <a
          href="https://intelligenxe.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/intelligenxe-wordmark.jpg"
            alt="Intelligenxe"
            width={400}
            height={35}
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
