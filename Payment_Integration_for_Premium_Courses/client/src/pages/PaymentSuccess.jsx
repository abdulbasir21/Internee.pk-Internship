import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { getCourseById } from '../services/api'
import Button from '../components/ui/Button'
import Loader from '../components/ui/Loader'

// Stripe redirects here after a successful checkout. We don't control the
// exact query string Stripe/the backend attaches to success_url, so this
// page works whether or not a courseId shows up in the URL — it just
// gives a more specific "go to it now" link when one does.
export default function PaymentSuccess() {
  const [searchParams] = useSearchParams()
  const courseId = searchParams.get('courseId')

  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(Boolean(courseId))

  useEffect(() => {
    if (!courseId) return
    getCourseById(courseId)
      .then((data) => setCourse(data.course))
      .catch(() => setCourse(null))
      .finally(() => setLoading(false))
  }, [courseId])

  if (loading) return <Loader label="Confirming your purchase…" />

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-5 py-24 text-center sm:px-8">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-forest-light text-forest">
        <CheckCircle2 size={32} />
      </div>
      <h1 className="mt-6 font-display text-3xl font-medium text-ink">Payment successful</h1>
      <p className="mt-3 text-sm text-ink-light">
        Your course is unlocked and ready — you can start learning right away.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        {course ? (
          <Button as={Link} to={`/courses/${course._id}`} variant="gold" size="lg">
            Go to {course.title}
          </Button>
        ) : null}
        <Button as={Link} to="/my-courses" variant={course ? 'ghost' : 'gold'} size="lg">
          View My Courses
        </Button>
      </div>
    </div>
  )
}
