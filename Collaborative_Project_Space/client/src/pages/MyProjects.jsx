import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FolderKanban, Users, ArrowRight } from "lucide-react";
import { projectsApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/layout/Navbar";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import { CardSkeletonGrid } from "../components/ui/Loader";

export default function MyProjects() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    projectsApi
      .list()
      .then(({ data }) => {
        if (!cancelled) setProjects(data.projects ?? data.data ?? []);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load your projects. Try refreshing.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <main className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-semibold text-ink tracking-tight">
            {user?.name?.split(" ")[0]}'s projects
          </h1>
          <p className="text-sm text-ink-soft mt-1.5">
            Pick a board to see what's moving right now.
          </p>
        </div>

        {loading ? (
          <CardSkeletonGrid />
        ) : error ? (
          <p className="text-sm text-danger">{error}</p>
        ) : projects.length === 0 ? (
          <Card className="py-4">
            <EmptyState
              icon={<FolderKanban size={18} />}
              title="You're not on any projects yet"
              description="Once an admin adds you to a project, it'll show up here."
            />
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((p, i) => (
              <button
                key={p._id}
                onClick={() => navigate(`/projects/${p._id}`)}
                style={{ animationDelay: `${i * 40}ms` }}
                className="fade-in-up group text-left bg-surface border border-border rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-brand/30"
              >
                <div className="flex items-start justify-between">
                  <span className="w-10 h-10 rounded-xl bg-brand-soft text-brand-dark flex items-center justify-center">
                    <FolderKanban size={18} />
                  </span>
                  <ArrowRight
                    size={16}
                    className="text-ink-faint opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200 mt-2"
                  />
                </div>
                <h3 className="font-display text-lg font-semibold text-ink mt-3.5">
                  {p.name}
                </h3>
                <p className="text-sm text-ink-soft mt-1 line-clamp-2 min-h-[2.5rem]">
                  {p.description || "No description yet."}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-ink-faint mt-4 pt-4 border-t border-border-soft">
                  <Users size={13} />
                  {p.members?.length ?? 0} member
                  {p.members?.length === 1 ? "" : "s"}
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
