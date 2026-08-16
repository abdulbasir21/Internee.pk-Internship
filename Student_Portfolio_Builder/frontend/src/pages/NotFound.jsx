import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

export default function NotFound() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-blueprint-dark">Error 404</p>
        <h1 className="mt-3 font-display text-4xl font-semibold">Page not found</h1>
        <p className="mt-2 text-ink/60">The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn-primary mt-6 inline-flex">
          Back home
        </Link>
      </div>
    </div>
  );
}
