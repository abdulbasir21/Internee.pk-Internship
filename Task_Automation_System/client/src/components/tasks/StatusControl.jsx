const STEPS = [
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In progress" },
  { value: "done", label: "Done" },
];

export default function StatusControl({ status, onChange, disabled }) {
  // Overdue is a derived display state, not a real workflow step — map it
  // back to "pending" so the control still highlights a real option.
  const activeValue = status === "overdue" ? "pending" : status;

  return (
    <div
      role="radiogroup"
      aria-label="Task status"
      className="inline-flex rounded-[var(--radius-control)] bg-ink-100 p-1 gap-1"
    >
      {STEPS.map((step) => {
        const active = step.value === activeValue;
        return (
          <button
            key={step.value}
            role="radio"
            aria-checked={active}
            disabled={disabled}
            onClick={() => !active && onChange(step.value)}
            className={`h-8 px-3 rounded-[8px] text-xs font-medium transition-all duration-150 ease-out
              disabled:cursor-not-allowed disabled:opacity-60
              ${active
                ? "bg-white text-ink-900 shadow-[var(--shadow-card)]"
                : "text-ink-500 hover:text-ink-700"}`}
          >
            {step.label}
          </button>
        );
      })}
    </div>
  );
}
