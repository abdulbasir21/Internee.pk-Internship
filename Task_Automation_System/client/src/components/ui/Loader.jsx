import { Loader2 } from "lucide-react";

export function PageLoader({ label = "Loading…" }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 py-24 text-ink-500">
      <Loader2 className="size-6 animate-spin text-brand-500" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function SkeletonLine({ className = "" }) {
  return <div className={`skeleton rounded-md ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="bg-surface rounded-[var(--radius-card)] border border-ink-100 p-5 flex flex-col gap-3">
      <SkeletonLine className="h-3 w-1/3" />
      <SkeletonLine className="h-7 w-1/2" />
      <SkeletonLine className="h-3 w-2/3" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-5 py-4 border-b border-ink-100 last:border-0">
      <SkeletonLine className="h-3 w-8 shrink-0" />
      <SkeletonLine className="h-3 flex-1" />
      <SkeletonLine className="h-3 w-24 shrink-0" />
      <SkeletonLine className="h-6 w-20 shrink-0 rounded-full" />
    </div>
  );
}
