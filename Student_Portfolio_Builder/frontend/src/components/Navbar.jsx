import { Link } from "react-router-dom";

export default function Navbar({ right }) {
  return (
    <header className="border-b-2 border-ink">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="group flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-sm border-2 border-ink bg-brass font-mono text-xs font-bold">
            IS
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            Showcase<span className="text-blueprint">.</span>
          </span>
        </Link>
        <nav className="flex items-center gap-3">{right}</nav>
      </div>
    </header>
  );
}
