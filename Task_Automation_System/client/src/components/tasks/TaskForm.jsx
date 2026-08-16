import { useState } from "react";
import { Plus } from "lucide-react";
import { Field, Input, Select, Textarea } from "../ui/Input";
import Button from "../ui/Button";

const EMPTY = { title: "", description: "", assignedTo: "", dueDate: "" };

export default function TaskForm({ interns, onCreate, creating }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  const update = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!values.title.trim()) next.title = "Give the task a title.";
    if (!values.assignedTo) next.assignedTo = "Choose who this is for.";
    if (!values.dueDate) next.dueDate = "Pick a due date.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    // The backend expects an ISO datetime for dueDate; the date input
    // gives us "YYYY-MM-DD", so normalize it before sending.
    await onCreate({
      ...values,
      dueDate: new Date(values.dueDate).toISOString(),
    });
    setValues(EMPTY);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-[var(--radius-card)] bg-surface border border-ink-100 shadow-[var(--shadow-card)] p-5 flex flex-col gap-4">
      <h3 className="font-display font-semibold text-ink-900">Create a task</h3>

      <Field label="Title" error={errors.title} htmlFor="task-title">
        <Input
          id="task-title"
          placeholder="e.g. Draft onboarding checklist"
          value={values.title}
          onChange={update("title")}
          error={!!errors.title}
        />
      </Field>

      <Field label="Description" hint="Optional — add any context the intern needs." htmlFor="task-desc">
        <Textarea
          id="task-desc"
          placeholder="What does done look like?"
          value={values.description}
          onChange={update("description")}
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Assign to" error={errors.assignedTo} htmlFor="task-intern">
          <Select id="task-intern" value={values.assignedTo} onChange={update("assignedTo")} error={!!errors.assignedTo}>
            <option value="">Select an intern</option>
            {interns.map((intern) => (
              <option key={intern.id} value={intern.id}>
                {intern.name}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Due date" error={errors.dueDate} htmlFor="task-due">
          <Input
            id="task-due"
            type="date"
            value={values.dueDate}
            onChange={update("dueDate")}
            error={!!errors.dueDate}
          />
        </Field>
      </div>

      <Button type="submit" icon={Plus} loading={creating} className="self-start">
        Create task
      </Button>
    </form>
  );
}
