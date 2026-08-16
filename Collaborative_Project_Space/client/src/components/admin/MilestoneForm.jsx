import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Button from "../ui/Button";
import { Field, Input } from "../ui/Input";
import { Spinner } from "../ui/Loader";

const EMPTY = { title: "", targetDate: "" };

export default function MilestoneForm({ open, onClose, onSubmit }) {
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm(EMPTY);
      setError("");
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Give the milestone a title.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await onSubmit({
        title: form.title.trim(),
        targetDate: form.targetDate || null,
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
        className="bg-surface w-full sm:max-w-sm sm:rounded-2xl rounded-t-3xl shadow-xl p-6 fade-in-up"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-semibold text-ink">
            New milestone
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
          <Field label="Title">
            <Input
              autoFocus
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Beta launch"
              maxLength={80}
            />
          </Field>

          <Field label="Target date" hint="Optional">
            <Input
              type="date"
              value={form.targetDate}
              onChange={(e) =>
                setForm((f) => ({ ...f, targetDate: e.target.value }))
              }
            />
          </Field>

          {error && <p className="text-sm text-danger">{error}</p>}

          <div className="flex items-center gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? <Spinner className="w-4 h-4" /> : "Create milestone"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
