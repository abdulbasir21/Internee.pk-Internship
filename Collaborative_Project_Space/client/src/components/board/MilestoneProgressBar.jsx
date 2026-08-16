// Progress is never trusted from local state — it's always whatever the
// server last computed (see PROGRESS.md: derived live from linked tasks,
// never stored) so this component is a pure display of server data.
export default function MilestoneProgressBar({ progress }) {
  const pct = Math.max(0, Math.min(100, progress ?? 0));
  const color =
    pct === 100 ? "var(--color-done)" : "var(--color-brand)";

  return (
    <div className="w-full h-2 rounded-full bg-sunken overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500 ease-out"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}
