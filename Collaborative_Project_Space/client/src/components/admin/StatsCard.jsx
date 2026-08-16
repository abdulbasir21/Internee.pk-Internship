import Card from "../ui/Card";

// One number, one label, one icon. Used three times on the dashboard
// (projects / interns / tasks) — kept generic rather than three
// near-duplicate components.
export default function StatsCard({ icon, label, value, loading }) {
  return (
    <Card className="p-5 flex items-center gap-4">
      <span className="w-11 h-11 rounded-xl bg-brand-soft text-brand-dark flex items-center justify-center shrink-0">
        {icon}
      </span>
      <div className="min-w-0">
        {loading ? (
          <div className="h-7 w-12 bg-sunken rounded-md animate-pulse" />
        ) : (
          <span className="font-display text-2xl font-semibold text-ink leading-none">
            {value}
          </span>
        )}
        <p className="text-sm text-ink-soft mt-1">{label}</p>
      </div>
    </Card>
  );
}
