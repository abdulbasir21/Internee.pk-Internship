import { Pencil, Trash2, ImageOff } from 'lucide-react'
import EmptyState from '../ui/EmptyState'
import Button from '../ui/Button'
import PremiumBadge from '../courses/PremiumBadge'

function Thumb({ course }) {
  return (
    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-ink">
      {course.previewImage ? (
        <img src={course.previewImage} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-gold-light/70">
          <ImageOff size={14} />
        </div>
      )}
    </div>
  )
}

function RowSkeleton() {
  return (
    <tr className="border-b border-line/60">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="skeleton h-10 w-10 rounded-lg" />
          <div className="skeleton h-4 w-40 rounded" />
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="skeleton h-4 w-24 rounded" />
      </td>
      <td className="px-4 py-4">
        <div className="skeleton h-5 w-20 rounded-full" />
      </td>
      <td className="px-4 py-4">
        <div className="skeleton h-4 w-20 rounded" />
      </td>
      <td className="px-4 py-4">
        <div className="skeleton ml-auto h-8 w-32 rounded-full" />
      </td>
    </tr>
  )
}

// Table on md+ screens, stacked cards on mobile — same course data, laid
// out the way each viewport can actually use it, rather than a table
// that just scrolls sideways on a phone.
export default function CourseTable({ courses, loading, onAdd, onEdit, onDelete, editingId }) {
  if (loading) {
    return (
      <div className="overflow-hidden rounded-card border border-line/60 bg-white">
        <table className="hidden w-full text-left md:table">
          <thead>
            <tr className="border-b border-line bg-paper/60 font-mono text-[11px] uppercase tracking-wide text-ink-faint">
              <th className="px-4 py-3 font-medium">Course</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 4 }).map((_, i) => (
              <RowSkeleton key={i} />
            ))}
          </tbody>
        </table>
        <div className="space-y-3 p-4 md:hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton h-24 w-full rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (!courses || courses.length === 0) {
    return (
      <EmptyState
        title="No courses yet"
        description="Add your first course to start building the catalog."
        action={
          <Button variant="gold" onClick={onAdd}>
            Add your first course
          </Button>
        }
      />
    )
  }

  return (
    <div className="overflow-hidden rounded-card border border-line/60 bg-white">
      {/* Desktop / tablet table */}
      <table className="hidden w-full text-left md:table">
        <thead>
          <tr className="border-b border-line bg-paper/60 font-mono text-[11px] uppercase tracking-wide text-ink-faint">
            <th className="px-4 py-3 font-medium">Course</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Created</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr
              key={course._id}
              className="border-b border-line/60 transition-colors last:border-0 hover:bg-paper/40"
            >
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <Thumb course={course} />
                  <span className="line-clamp-1 font-display text-sm font-medium text-ink">
                    {course.title}
                  </span>
                </div>
              </td>
              <td className="px-4 py-4 text-sm text-ink-light">{course.category}</td>
              <td className="px-4 py-4">
                <PremiumBadge isFree={course.isFree} price={course.price} />
              </td>
              <td className="px-4 py-4 text-sm text-ink-light">
                {course.createdAt ? new Date(course.createdAt).toLocaleDateString() : '—'}
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(course)}
                    loading={editingId === course._id}
                  >
                    <Pencil size={14} /> Edit
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => onDelete(course)}>
                    <Trash2 size={14} /> Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile stacked cards */}
      <div className="divide-y divide-line/60 md:hidden">
        {courses.map((course) => (
          <div key={course._id} className="flex flex-col gap-3 p-4">
            <div className="flex items-center gap-3">
              <Thumb course={course} />
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 font-display text-sm font-medium text-ink">{course.title}</p>
                <p className="font-mono text-[11px] uppercase tracking-wide text-ink-faint">
                  {course.category}
                </p>
              </div>
              <PremiumBadge isFree={course.isFree} price={course.price} />
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1"
                onClick={() => onEdit(course)}
                loading={editingId === course._id}
              >
                <Pencil size={14} /> Edit
              </Button>
              <Button variant="danger" size="sm" className="flex-1" onClick={() => onDelete(course)}>
                <Trash2 size={14} /> Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
