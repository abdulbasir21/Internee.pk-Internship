export function Spinner({ className = "" }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2.5"
        opacity="0.2"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Skeleton shown while the board's first fetch (tasks + milestones) is
// in flight, so the layout doesn't pop into place empty-then-full.
export function BoardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-pulse">
      {[0, 1, 2].map((col) => (
        <div key={col} className="bg-sunken rounded-2xl p-4 space-y-3">
          <div className="h-4 w-24 bg-border rounded-full mb-4" />
          {[0, 1].map((c) => (
            <div
              key={c}
              className="h-24 bg-surface border border-border-soft rounded-xl"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="h-36 bg-surface border border-border rounded-2xl"
        />
      ))}
    </div>
  );
}
