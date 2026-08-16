import CourseCard from './CourseCard'
import { CourseCardSkeleton } from '../ui/Skeleton'
import EmptyState from '../ui/EmptyState'

export default function CourseGrid({ courses, loading, purchasedIds = [], emptyMessage }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CourseCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (!courses || courses.length === 0) {
    return (
      <EmptyState
        title="No courses here yet"
        description={emptyMessage || 'Check back soon — new courses are added regularly.'}
      />
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course, i) => (
        <div
          key={course._id}
          className="animate-fadeUp"
          style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
        >
          <CourseCard course={course} owned={purchasedIds.includes(course._id)} />
        </div>
      ))}
    </div>
  )
}
