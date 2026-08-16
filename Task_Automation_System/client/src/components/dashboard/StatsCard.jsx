export default function StatsCard({ label, value, icon: Icon, tone = "brand", suffix = "" }) {
  const tones = {
    brand: { bg: "bg-brand-50", text: "text-brand-500", rail: "bg-brand-500" },
    done: { bg: "bg-done-bg", text: "text-done", rail: "bg-done-rail" },
    overdue: { bg: "bg-overdue-bg", text: "text-overdue", rail: "bg-overdue-rail" },
    progress: { bg: "bg-progress-bg", text: "text-progress", rail: "bg-progress-rail" },
  };
  const t = tones[tone] || tones.brand;

  return (
    <div className="relative overflow-hidden rounded-[var(--radius-card)] bg-surface border border-ink-100 shadow-[var(--shadow-card)] p-5 flex flex-col gap-3 animate-fade-in-up">
      <span className={`absolute inset-x-0 top-0 h-1 ${t.rail}`} aria-hidden="true" />
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-ink-500">{label}</span>
        {Icon && (
          <span className={`flex size-8 items-center justify-center rounded-lg ${t.bg} ${t.text}`}>
            <Icon className="size-4" strokeWidth={2} />
          </span>
        )}
      </div>
      <span className="font-display text-3xl font-semibold text-ink-900 font-mono-num">
        {value}
        {suffix && <span className="text-lg text-ink-500">{suffix}</span>}
      </span>
    </div>
  );
}
