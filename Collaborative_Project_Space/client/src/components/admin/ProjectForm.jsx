import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Button from "../ui/Button";
import { Field, Input, Textarea } from "../ui/Input";
import { Spinner } from "../ui/Loader";
import MemberSelector from "./MemberSelector";

const EMPTY = { name: "", description: "" };

// Same shape as TaskFormModal: one modal, one submit path. Create-only
// (no edit mode) since PROGRESS.md doesn't expose a project-update
// endpoint yet — FRONTEND_PROGRESS.md §2 already calls that out.
export default function ProjectForm({ open, onClose, onSubmit, interns }) {
  const [form, setForm] = useState(EMPTY);
  const [memberIds, setMemberIds] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm(EMPTY);
      setMemberIds([]);
      setError("");
    }
  }, [open]);

  if (!open) return null;

  const toggleMember = (id) =>
    setMemberIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Give the project a name.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await onSubmit({
        name: form.name.trim(),
        description: form.description.trim(),
        memberIds,
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/40 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl shadow-xl p-6 max-h-[90vh] overflow-y-auto fade-in-up"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-semibold text-ink">
            New project
          </h2>
          <button
            onClick={onClose}
            className="text-ink-faint hover:text-ink w-8 h-8 flex items-center justify-center rounded-lg hover:bg-sunken"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Name">
            <Input
              autoFocus
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Onboarding Revamp"
              maxLength={80}
            />
          </Field>

          <Field label="Description" hint="Optional">
            <Textarea
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="What's this project about?"
            />
          </Field>

          <Field label="Members" hint="Optional — you can add more later">
            <MemberSelector
              interns={interns}
              selectedIds={memberIds}
              onToggle={toggleMember}
              emptyLabel="No interns yet — you can assign members later."
            />
          </Field>

          {error && <p className="text-sm text-danger">{error}</p>}

          <div className="flex items-center gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? <Spinner className="w-4 h-4" /> : "Create project"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
