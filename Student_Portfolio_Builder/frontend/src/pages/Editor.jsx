import { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import ProjectFormModal from "../components/ProjectFormModal.jsx";
import {
  getEditorPortfolio,
  updatePortfolio,
  createProject,
  updateProject,
  deleteProject,
  getEditKey,
} from "../api/client.js";

export default function Editor() {
  const { id } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [projects, setProjects] = useState([]);
  const [profileForm, setProfileForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const hasKey = Boolean(getEditKey(id));

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getEditorPortfolio(id);
      setPortfolio(data.portfolio);
      setProjects(data.projects);
      setProfileForm({
        name: data.portfolio.name || "",
        role: data.portfolio.role || "",
        bio: data.portfolio.bio || "",
        avatarUrl: data.portfolio.avatarUrl || "",
        socialLinks: {
          github: data.portfolio.socialLinks?.github || "",
          linkedin: data.portfolio.socialLinks?.linkedin || "",
          website: data.portfolio.socialLinks?.website || "",
          email: data.portfolio.socialLinks?.email || "",
        },
      });
    } catch (err) {
      setError(
        err?.response?.status === 401 || err?.response?.status === 403
          ? "This browser doesn't have edit access to this showcase."
          : err?.response?.data?.message || "Couldn't load this showcase."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function saveProfile(e) {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSaved(false);
    try {
      const { portfolio: updated } = await updatePortfolio(id, profileForm);
      setPortfolio(updated);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2000);
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't save profile.");
    } finally {
      setSavingProfile(false);
    }
  }

  function openNewProject() {
    setEditingProject(null);
    setModalOpen(true);
  }
  function openEditProject(project) {
    setEditingProject(project);
    setModalOpen(true);
  }

  async function handleProjectSubmit(formData) {
    setSubmitting(true);
    try {
      if (editingProject) {
        const { project } = await updateProject(id, editingProject._id, formData);
        setProjects((prev) => prev.map((p) => (p._id === project._id ? project : p)));
      } else {
        const { project } = await createProject(id, formData);
        setProjects((prev) => [...prev, project]);
      }
      setModalOpen(false);
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't save project.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(project) {
    if (!window.confirm(`Delete "${project.title}"? This can't be undone.`)) return;
    try {
      await deleteProject(id, project._id);
      setProjects((prev) => prev.filter((p) => p._id !== project._id));
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't delete project.");
    }
  }

  const shareUrl = portfolio ? `${window.location.origin}/p/${portfolio.slug}` : "";

  function copyLink() {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <p className="mx-auto max-w-6xl px-6 py-16 font-mono text-sm text-ink/50">Loading editor…</p>
      </div>
    );
  }

  if (error && !portfolio) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="mx-auto max-w-xl px-6 py-16 text-center">
          <p className="rounded-sm border-2 border-ink bg-white p-6">{error}</p>
          <Link to="/create" className="btn-primary mt-6 inline-flex">
            Create a new showcase
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <Navbar
        right={
          portfolio && (
            <Link to={`/p/${portfolio.slug}`} target="_blank" className="btn-secondary">
              View public page ↗
            </Link>
          )
        }
      />

      <div className="bp-grid border-b-2 border-ink">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-blueprint-dark">Editor</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">
            {portfolio?.name}'s showcase
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-sm border-2 border-ink bg-white px-4 py-2 font-mono text-sm">
              {shareUrl}
            </div>
            <button onClick={copyLink} className="btn-accent">
              {copied ? "Copied ✓" : "Copy shareable link"}
            </button>
          </div>
          {!hasKey && (
            <p className="mt-3 max-w-lg text-sm text-brass-dark">
              Note: edit access for this showcase is tied to this browser. Bookmark this editor
              URL — without the stored key you won't be able to make changes from another device.
            </p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6">
        {/* Profile form */}
        <section className="mt-10">
          <h2 className="font-display text-2xl font-semibold">Profile</h2>
          <form
            onSubmit={saveProfile}
            className="crop-marks mt-4 rounded-sm border-2 border-ink bg-white p-6 shadow-spec"
          >
            <span className="cm-tr" />
            <span className="cm-br" />

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="field-label">Name</label>
                <input
                  className="field-input"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="field-label">Role / internship title</label>
                <input
                  className="field-input"
                  value={profileForm.role}
                  onChange={(e) => setProfileForm((p) => ({ ...p, role: e.target.value }))}
                />
              </div>
            </div>

            <div className="mt-5">
              <label className="field-label">Bio</label>
              <textarea
                rows={3}
                className="field-textarea"
                value={profileForm.bio}
                onChange={(e) => setProfileForm((p) => ({ ...p, bio: e.target.value }))}
              />
            </div>

            <div className="mt-5">
              <label className="field-label">Avatar image URL</label>
              <input
                className="field-input"
                placeholder="https://…"
                value={profileForm.avatarUrl}
                onChange={(e) => setProfileForm((p) => ({ ...p, avatarUrl: e.target.value }))}
              />
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label className="field-label">GitHub</label>
                <input
                  className="field-input"
                  placeholder="https://github.com/…"
                  value={profileForm.socialLinks.github}
                  onChange={(e) =>
                    setProfileForm((p) => ({ ...p, socialLinks: { ...p.socialLinks, github: e.target.value } }))
                  }
                />
              </div>
              <div>
                <label className="field-label">LinkedIn</label>
                <input
                  className="field-input"
                  placeholder="https://linkedin.com/in/…"
                  value={profileForm.socialLinks.linkedin}
                  onChange={(e) =>
                    setProfileForm((p) => ({ ...p, socialLinks: { ...p.socialLinks, linkedin: e.target.value } }))
                  }
                />
              </div>
              <div>
                <label className="field-label">Website</label>
                <input
                  className="field-input"
                  placeholder="https://…"
                  value={profileForm.socialLinks.website}
                  onChange={(e) =>
                    setProfileForm((p) => ({ ...p, socialLinks: { ...p.socialLinks, website: e.target.value } }))
                  }
                />
              </div>
              <div>
                <label className="field-label">Contact email</label>
                <input
                  className="field-input"
                  placeholder="you@example.com"
                  value={profileForm.socialLinks.email}
                  onChange={(e) =>
                    setProfileForm((p) => ({ ...p, socialLinks: { ...p.socialLinks, email: e.target.value } }))
                  }
                />
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4 border-t border-line pt-5">
              <button type="submit" disabled={savingProfile} className="btn-primary disabled:opacity-60">
                {savingProfile ? "Saving…" : "Save profile"}
              </button>
              {profileSaved && <span className="font-mono text-sm text-sage">Saved ✓</span>}
            </div>
          </form>
        </section>

        {/* Projects */}
        <section className="mt-14">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-semibold">
              Projects <span className="text-ink/40">({projects.length})</span>
            </h2>
            <button onClick={openNewProject} className="btn-accent">
              + Add project
            </button>
          </div>

          {error && (
            <p className="mt-4 rounded-sm border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          {projects.length === 0 ? (
            <div className="crop-marks mt-6 rounded-sm border-2 border-dashed border-ink/30 bg-white/60 p-12 text-center">
              <p className="font-display text-xl">No entries yet</p>
              <p className="mt-1 text-ink/60">Add your first project to start filling the showcase.</p>
              <button onClick={openNewProject} className="btn-accent mt-5">
                + Add project
              </button>
            </div>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, i) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  index={i}
                  editable
                  onEdit={openEditProject}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <ProjectFormModal
        open={modalOpen}
        initial={editingProject}
        onClose={() => setModalOpen(false)}
        onSubmit={handleProjectSubmit}
        submitting={submitting}
      />
    </div>
  );
}
