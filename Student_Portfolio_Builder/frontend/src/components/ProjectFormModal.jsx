import { useEffect, useState } from "react";

const emptyForm = {
  title: "",
  role: "",
  description: "",
  tags: "",
  projectUrl: "",
  repoUrl: "",
};

export default function ProjectFormModal({ open, initial, onClose, onSubmit, submitting }) {
  const [form, setForm] = useState(emptyForm);
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title || "",
        role: initial.role || "",
        description: initial.description || "",
        tags: (initial.tags || []).join(", "),
        projectUrl: initial.projectUrl || "",
        repoUrl: initial.repoUrl || "",
      });
      setExistingImages(initial.images || []);
    } else {
      setForm(emptyForm);
      setExistingImages([]);
    }
    setNewFiles([]);
    setError("");
  }, [initial, open]);

  if (!open) return null;

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function removeExisting(url) {
    setExistingImages((prev) => prev.filter((u) => u !== url));
  }

  function handleFiles(e) {
    const files = Array.from(e.target.files || []);
    setNewFiles((prev) => [...prev, ...files].slice(0, 6));
  }

  function removeNewFile(idx) {
    setNewFiles((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      setError("Title and description are required.");
      return;
    }
    setError("");

    const fd = new FormData();
    fd.append("title", form.title.trim());
    fd.append("description", form.description.trim());
    fd.append("role", form.role);
    fd.append("projectUrl", form.projectUrl);
    fd.append("repoUrl", form.repoUrl);
    fd.append("tags", form.tags);
    existingImages.forEach((url) => fd.append("existingImages", url));
    newFiles.forEach((file) => fd.append("images", file));

    onSubmit(fd);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/50 p-4 py-10 backdrop-blur-sm">
      <div className="crop-marks w-full max-w-2xl rounded-sm border-2 border-ink bg-white p-7 shadow-spec">
        <span className="cm-tr" />
        <span className="cm-br" />

        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-blueprint-dark">
              {initial ? "Editing entry" : "New entry"}
            </p>
            <h2 className="mt-1 font-display text-2xl font-semibold">
              {initial ? "Update project" : "Add a project"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-sm border-2 border-ink px-2.5 py-1 font-mono text-xs uppercase hover:bg-ink hover:text-paper"
            aria-label="Close"
          >
            Esc
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="field-label">Title *</label>
              <input
                className="field-input"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="Realtime Analytics Dashboard"
              />
            </div>
            <div>
              <label className="field-label">Role on project</label>
              <input
                className="field-input"
                value={form.role}
                onChange={(e) => update("role", e.target.value)}
                placeholder="Frontend Intern"
              />
            </div>
          </div>

          <div>
            <label className="field-label">Description *</label>
            <textarea
              rows={4}
              className="field-textarea"
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="What the project does, your contribution, and the outcome."
            />
          </div>

          <div>
            <label className="field-label">Tags (comma separated)</label>
            <input
              className="field-input"
              value={form.tags}
              onChange={(e) => update("tags", e.target.value)}
              placeholder="react, node, mongodb"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="field-label">Live demo URL</label>
              <input
                className="field-input"
                value={form.projectUrl}
                onChange={(e) => update("projectUrl", e.target.value)}
                placeholder="https://"
              />
            </div>
            <div>
              <label className="field-label">Source / repo URL</label>
              <input
                className="field-input"
                value={form.repoUrl}
                onChange={(e) => update("repoUrl", e.target.value)}
                placeholder="https://github.com/…"
              />
            </div>
          </div>

          <div>
            <label className="field-label">Images (up to 6)</label>

            {existingImages.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {existingImages.map((url) => (
                  <div key={url} className="relative">
                    <img src={url} alt="" className="h-16 w-16 rounded-sm border-2 border-ink object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExisting(url)}
                      className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border-2 border-ink bg-white text-[10px] font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {newFiles.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {newFiles.map((file, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt=""
                      className="h-16 w-16 rounded-sm border-2 border-brass object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewFile(idx)}
                      className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border-2 border-ink bg-white text-[10px] font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <input type="file" accept="image/*" multiple onChange={handleFiles} className="font-body text-sm" />
          </div>

          {error && (
            <p className="rounded-sm border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}

          <div className="flex justify-end gap-3 border-t border-line pt-5">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-accent disabled:opacity-60">
              {submitting ? "Saving…" : initial ? "Save changes" : "Add project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
