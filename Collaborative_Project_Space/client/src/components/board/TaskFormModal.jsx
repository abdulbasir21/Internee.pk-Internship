import { useEffect, useState } from "react";
import { X, Trash2 } from "lucide-react";
import Button from "../ui/Button";
import { Field, Input, Textarea, Select } from "../ui/Input";
import { Spinner } from "../ui/Loader";

const EMPTY = {
  title: "",
  description: "",
  status: "todo",
  assignedTo: "",
  milestoneId: "",
};

// Handles both "Add Task" (task === null) and editing an existing task,
// so there's one modal and one submit path instead of two near-duplicates.
export default function TaskFormModal({
  open,
  onClose,
  onSubmit,
  onDelete,
  task,
  members,
  milestones,
}) {
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm(
        task
          ? {
              title: task.title ?? "",
              description: task.description ?? "",
              status: task.status ?? "todo",
              assignedTo: task.assignedTo?._id ?? "",
              milestoneId: task.milestoneId ?? "",
            }
          : EMPTY
      );
      setError("");
    }
  }, [open, task]);

  if (!open) return null;

  const handleChange = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Give the task a title.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await onSubmit({
        title: form.title.trim(),
        description: form.description.trim(),
        status: form.status,
        assignedTo: form.assignedTo || null,
        milestoneId: form.milestoneId || null,
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await onDelete(task._id);
      onClose();
    } catch {
      setError("Couldn't delete this task. Try again.");
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
            {task ? "Edit task" : "Add task"}
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
              onChange={handleChange("title")}
              placeholder="e.g. Wire up the login form"
              maxLength={120}
            />
          </Field>

          <Field label="Description" hint="Optional">
            <Textarea
              rows={3}
              value={form.description}
              onChange={handleChange("description")}
              placeholder="Add any useful context…"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Status">
              <Select value={form.status} onChange={handleChange("status")}>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </Select>
            </Field>

            <Field label="Assignee">
              <Select
                value={form.assignedTo}
                onChange={handleChange("assignedTo")}
              >
                <option value="">Unassigned</option>
                {members.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <Field label="Milestone" hint="Optional — link this task to a milestone">
            <Select
              value={form.milestoneId}
              onChange={handleChange("milestoneId")}
            >
              <option value="">No milestone</option>
              {milestones.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.title}
                </option>
              ))}
            </Select>
          </Field>

          {error && <p className="text-sm text-danger">{error}</p>}

          <div className="flex items-center gap-2 pt-2">
            {task && (
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={handleDelete}
                disabled={submitting}
                className="text-danger hover:bg-danger-soft hover:text-danger mr-auto !px-2.5"
                aria-label="Delete task"
              >
                <Trash2 size={16} />
              </Button>
            )}
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <Spinner className="w-4 h-4" />
              ) : task ? (
                "Save changes"
              ) : (
                "Add task"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
