import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { createPortfolio, saveEditKey } from "../api/client.js";

export default function Create() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", role: "", bio: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Enter your name to continue.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const { portfolio, editKey } = await createPortfolio(form);
      saveEditKey(portfolio.id, editKey);
      navigate(`/editor/${portfolio.id}`);
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="bp-grid min-h-[calc(100vh-73px)]">
        <div className="mx-auto max-w-xl px-6 py-16">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-blueprint-dark">
            Spec Sheet — Step 01
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">
            Draft your profile
          </h1>
          <p className="mt-2 text-ink/65">
            This is the header of your showcase. You can refine it any time from the editor.
          </p>

          <form onSubmit={handleSubmit} className="crop-marks mt-8 rounded-sm border-2 border-ink bg-white p-7 shadow-spec">
            <span className="cm-tr" />
            <span className="cm-br" />

            <div className="mb-5">
              <label className="field-label" htmlFor="name">
                Full name *
              </label>
              <input
                id="name"
                className="field-input"
                placeholder="Amina Raza"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
              />
            </div>

            <div className="mb-5">
              <label className="field-label" htmlFor="role">
                Role / internship title
              </label>
              <input
                id="role"
                className="field-input"
                placeholder="Software Engineering Intern @ Acme Corp"
                value={form.role}
                onChange={(e) => update("role", e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label className="field-label" htmlFor="bio">
                Short bio
              </label>
              <textarea
                id="bio"
                rows={4}
                className="field-textarea"
                placeholder="A sentence or two about what you're studying and building."
                value={form.bio}
                onChange={(e) => update("bio", e.target.value)}
              />
            </div>

            {error && (
              <p className="mb-4 rounded-sm border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}

            <button type="submit" disabled={loading} className="btn-accent w-full justify-center disabled:opacity-60">
              {loading ? "Creating…" : "Continue to editor →"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
