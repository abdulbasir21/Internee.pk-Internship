import { useEffect, useState } from 'react'
import { getCourses } from '../services/api'
import CourseGrid from '../components/courses/CourseGrid'

export default function Home() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const data = await getCourses()
        if (!cancelled) setCourses(data.courses || [])
      } catch {
        if (!cancelled) setError("Couldn't load the catalog. Try refreshing.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const freeCount = courses.filter((c) => c.isFree).length
  const premiumCount = courses.length - freeCount

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <section className="mb-12 max-w-2xl">
        <span className="font-mono text-xs uppercase tracking-widest text-gold-dark">
          The full catalog
        </span>
        <h1 className="mt-3 font-display text-4xl font-medium leading-tight text-ink sm:text-5xl">
          Learn something worth finishing.
        </h1>
        <p className="mt-4 text-base text-ink-light">
          Browse every course we offer. Free ones open right up — premium ones unlock the
          moment you check out.
        </p>
        {!loading && !error && courses.length > 0 && (
          <p className="mt-5 font-mono text-xs uppercase tracking-wide text-ink-faint">
            {courses.length} course{courses.length === 1 ? '' : 's'} · {freeCount} free ·{' '}
            {premiumCount} premium
          </p>
        )}
      </section>

      {error ? (
        <p className="rounded-card border border-danger/30 bg-danger-light px-5 py-4 text-sm text-danger">
          {error}
        </p>
      ) : (
        <CourseGrid courses={courses} loading={loading} />
      )}
    </div>
  )
}
