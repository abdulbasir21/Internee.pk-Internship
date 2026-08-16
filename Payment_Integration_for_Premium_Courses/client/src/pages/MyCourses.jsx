import { useEffect, useState } from 'react'
import { getCourses, getCourseById } from '../services/api'
import CourseGrid from '../components/courses/CourseGrid'

// There's no dedicated "my purchased courses" endpoint in the backend yet
// (see PROGRESS.md), so this page works out access the same way the
// public detail page does: it asks the server, per premium course,
// whether *this* logged-in student's token unlocks it — the presence of
// `content` in the response is the source of truth for ownership.
// Free courses are always accessible and skip that check.
export default function MyCourses() {
  const [accessibleCourses, setAccessibleCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const { courses } = await getCourses()
        const free = (courses || []).filter((c) => c.isFree)
        const premium = (courses || []).filter((c) => !c.isFree)

        const premiumChecks = await Promise.all(
          premium.map((c) =>
            getCourseById(c._id)
              .then((data) => (Array.isArray(data.course?.content) && data.course.content.length ? c : null))
              .catch(() => null)
          )
        )

        const owned = premiumChecks.filter(Boolean)
        if (!cancelled) setAccessibleCourses([...free, ...owned])
      } catch {
        if (!cancelled) setError("Couldn't load your courses. Try refreshing.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <section className="mb-10 max-w-2xl">
        <span className="font-mono text-xs uppercase tracking-widest text-gold-dark">
          Your library
        </span>
        <h1 className="mt-3 font-display text-4xl font-medium leading-tight text-ink">
          My Courses
        </h1>
        <p className="mt-4 text-base text-ink-light">
          Everything you own — free courses and the premium ones you've unlocked.
        </p>
      </section>

      {error ? (
        <p className="rounded-card border border-danger/30 bg-danger-light px-5 py-4 text-sm text-danger">
          {error}
        </p>
      ) : (
        <CourseGrid
          courses={accessibleCourses}
          loading={loading}
          purchasedIds={accessibleCourses.map((c) => c._id)}
          emptyMessage="No purchased courses yet — unlock a premium course or browse what's free."
        />
      )}
    </div>
  )
}
