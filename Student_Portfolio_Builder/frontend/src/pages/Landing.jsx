import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

const steps = [
  {
    n: "01",
    title: "Draft your profile",
    body: "Name, role, and a short bio — the header plate for your showcase.",
  },
  {
    n: "02",
    title: "Log each project",
    body: "Add a title, description, tags, and screenshots for every project worth showing.",
  },
  {
    n: "03",
    title: "Publish the link",
    body: "Get a clean, shareable URL to drop in applications, emails, and your resume.",
  },
];

const features = [
  {
    title: "Built for interns",
    body: "No portfolio-building learning curve. Fill in the spec sheet, publish, done.",
  },
  {
    title: "Image-ready uploads",
    body: "Drop in screenshots or product shots per project — stored and served automatically.",
  },
  {
    title: "One clean shareable link",
    body: "A single, permanent URL that renders your entire body of work for recruiters.",
  },
  {
    title: "Tag & classify",
    body: "Label projects by stack, discipline, or team so viewers can scan your range fast.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      <Navbar
        right={
          <Link to="/create" className="btn-primary">
            Build your showcase
          </Link>
        }
      />

      {/* Hero */}
      <section className="bp-grid relative overflow-hidden border-b-2 border-ink">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.25em] text-blueprint-dark">
            Intern Project Showcase Platform — Spec No. 001
          </p>
          <h1 className="max-w-3xl font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
            Your internship, drafted into something worth sharing.
          </h1>
          <p className="mt-6 max-w-xl font-body text-lg text-ink/70">
            Turn scattered project files and screenshots into a single, professionally designed
            page — with a link you can hand to any recruiter.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link to="/create" className="btn-accent">
              Start your showcase →
            </Link>
            <a href="#how-it-works" className="btn-secondary">
              See how it works
            </a>
          </div>
        </div>

        {/* Decorative spec card, like a project entry pinned to the blueprint */}
        <div className="pointer-events-none absolute -right-10 top-16 hidden w-72 rotate-3 lg:block">
          <div className="crop-marks rounded-sm border-2 border-ink bg-white p-5 shadow-spec">
            <span className="cm-tr" />
            <span className="cm-br" />
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink/50">
              Entry / 03
            </p>
            <p className="mt-2 font-display text-xl font-medium">Realtime Analytics Dashboard</p>
            <p className="mt-2 text-sm text-ink/60">
              React · Node.js · MongoDB — built during a 10-week data eng internship.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="spec-tag">frontend</span>
              <span className="spec-tag">data</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-3xl font-semibold tracking-tight">
          Everything the showcase needs, nothing it doesn't.
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {features.map((f) => (
            <div key={f.title} className="rounded-sm border-2 border-ink bg-white p-6">
              <h3 className="font-display text-xl font-medium">{f.title}</h3>
              <p className="mt-2 text-ink/65">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works — a real, ordered sequence, so numbering earns its place */}
      <section id="how-it-works" className="border-y-2 border-ink bg-ink text-paper">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="font-display text-3xl font-semibold tracking-tight">How it works</h2>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n}>
                <p className="font-mono text-sm text-brass-light">{s.n}</p>
                <h3 className="mt-2 font-display text-2xl font-medium">{s.title}</h3>
                <p className="mt-2 text-paper/70">{s.body}</p>
              </div>
            ))}
          </div>
          <Link to="/create" className="btn-accent mt-12 inline-flex">
            Build your showcase →
          </Link>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 py-10 text-center font-mono text-xs uppercase tracking-widest text-ink/40">
        Showcase — an internship project presentation platform
      </footer>
    </div>
  );
}
