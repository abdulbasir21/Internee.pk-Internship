import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import { getPublicPortfolio } from "../api/client.js";

export default function Public() {
  const { slug } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ok | notfound

  useEffect(() => {
    let active = true;
    getPublicPortfolio(slug)
      .then((data) => {
        if (!active) return;
        setPortfolio(data.portfolio);
        setProjects(data.projects);
        setStatus("ok");
      })
      .catch(() => active && setStatus("notfound"));
    return () => {
      active = false;
    };
  }, [slug]);

  if (status === "loading") {
    return (
      <div className="min-h-screen">
        <Navbar />
        <p className="mx-auto max-w-6xl px-6 py-16 font-mono text-sm text-ink/50">Loading showcase…</p>
      </div>
    );
  }

  if (status === "notfound") {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="mx-auto max-w-xl px-6 py-20 text-center">
          <p className="font-display text-3xl font-semibold">Showcase not found</p>
          <p className="mt-2 text-ink/60">This link doesn't match any published showcase.</p>
          <Link to="/" className="btn-primary mt-6 inline-flex">
            Go home
          </Link>
        </div>
      </div>
    );
  }

  const { socialLinks = {} } = portfolio;
  const links = [
    socialLinks.website && { label: "Website", href: socialLinks.website },
    socialLinks.github && { label: "GitHub", href: socialLinks.github },
    socialLinks.linkedin && { label: "LinkedIn", href: socialLinks.linkedin },
    socialLinks.email && { label: "Email", href: `mailto:${socialLinks.email}` },
  ].filter(Boolean);

  return (
    <div className="min-h-screen">
      <Navbar
        right={
          <Link to="/create" className="btn-secondary">
            Build your own
          </Link>
        }
      />

      {/* Profile header */}
      <section className="bp-grid border-b-2 border-ink">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            {portfolio.avatarUrl ? (
              <img
                src={portfolio.avatarUrl}
                alt={portfolio.name}
                className="h-24 w-24 rounded-sm border-2 border-ink object-cover shadow-spec-sm"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-sm border-2 border-ink bg-brass font-display text-3xl font-semibold shadow-spec-sm">
                {portfolio.name?.[0]?.toUpperCase() || "?"}
              </div>
            )}
            <div>
              {portfolio.role && (
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-blueprint-dark">
                  {portfolio.role}
                </p>
              )}
              <h1 className="mt-1 font-display text-4xl font-semibold tracking-tight md:text-5xl">
                {portfolio.name}
              </h1>
              {portfolio.bio && <p className="mt-3 max-w-2xl text-ink/70">{portfolio.bio}</p>}

              {links.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-4">
                  {links.map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-xs uppercase tracking-wide text-blueprint hover:text-blueprint-dark"
                    >
                      {l.label} ↗
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Projects grid */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="font-display text-2xl font-semibold">
          Projects <span className="text-ink/40">({projects.length})</span>
        </h2>

        {projects.length === 0 ? (
          <p className="mt-6 text-ink/50">No projects published yet.</p>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <ProjectCard key={project._id} project={project} index={i} editable={false} />
            ))}
          </div>
        )}
      </section>

      <footer className="border-t-2 border-ink py-8 text-center font-mono text-xs uppercase tracking-widest text-ink/40">
        Made with Showcase
      </footer>
    </div>
  );
}
