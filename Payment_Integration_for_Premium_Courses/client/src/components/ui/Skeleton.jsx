export function CourseCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-card border border-line/60 bg-white">
      <div className="skeleton h-36 w-full" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="skeleton h-3 w-16 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-2/3 rounded" />
      </div>
      <div className="ticket-stub flex items-center justify-between px-5 py-4">
        <div className="skeleton h-3 w-20 rounded" />
        <div className="skeleton h-3 w-10 rounded" />
      </div>
    </div>
  )
}
