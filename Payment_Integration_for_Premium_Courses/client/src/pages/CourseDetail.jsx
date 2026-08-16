import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Lock, PlayCircle, ArrowLeft } from 'lucide-react'
import { getCourseById, createCheckoutSession } from '../services/api'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import Loader from '../components/ui/Loader'
import PremiumBadge from '../components/courses/PremiumBadge'
import PaymentModal from '../components/courses/PaymentModal'

export default function CourseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')

    getCourseById(id)
      .then((data) => {
        if (!cancelled) setCourse(data.course)
      })
      .catch(() => {
        if (!cancelled) setError("This course doesn't exist or couldn't be loaded.")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id])

  const handleUnlockClick = () => {
    // Clicking Unlock while logged out sends the student to log in first,
    // remembering this exact course so they land right back here.
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/courses/${id}` } })
      return
    }
    setCheckoutError('')
    setPaymentModalOpen(true)
  }

  // Fires from inside the payment modal ("Proceed to payment") — creates the
  // Stripe Checkout session and hands off to Stripe's hosted payment page,
  // where the card details are actually collected.
  const handleConfirmPayment = async () => {
    setCheckoutLoading(true)
    setCheckoutError('')
    try {
      const data = await createCheckoutSession(id)
      window.location.href = data.url
    } catch (err) {
      setCheckoutError(
        err?.response?.data?.message || 'Could not start checkout. Please try again.'
      )
      setCheckoutLoading(false)
    }
  }

  if (loading) return <Loader label="Loading course…" />

  if (error || !course) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 text-center">
        <h1 className="font-display text-2xl text-ink">Course not found</h1>
        <p className="mt-2 text-sm text-ink-light">{error}</p>
        <Button as={Link} to="/" variant="ghost" className="mt-6">
          <ArrowLeft size={15} /> Back to catalog
        </Button>
      </div>
    )
  }

  const hasContent = Array.isArray(course.content) && course.content.length > 0

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-light hover:text-ink"
      >
        <ArrowLeft size={15} /> Back to catalog
      </Link>

      <div className="overflow-hidden rounded-card border border-line/60 bg-white shadow-card">
        <div className="relative h-56 w-full bg-ink sm:h-72">
          {course.previewImage ? (
            <img src={course.previewImage} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ink to-[#243358] font-display text-5xl text-gold-light/70">
              {course.title?.charAt(0) ?? '?'}
            </div>
          )}
        </div>

        <div className="p-6 sm:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <PremiumBadge isFree={course.isFree} price={course.price} />
            <span className="font-mono text-xs uppercase tracking-wide text-ink-faint">
              {course.category}
            </span>
          </div>

          <h1 className="mt-4 font-display text-3xl font-medium leading-tight text-ink sm:text-4xl">
            {course.title}
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-light">
            {course.description}
          </p>

          <div className="ticket-stub mt-8 flex flex-col items-start gap-4 pt-8 sm:flex-row sm:items-center sm:justify-between">
            {hasContent ? (
              <div className="w-full rounded-lg border border-forest/25 bg-forest-light px-5 py-4">
                <p className="flex items-center gap-2 text-sm font-medium text-forest">
                  <PlayCircle size={16} /> You have access to this course
                </p>
              </div>
            ) : (
              <div className="w-full rounded-lg border border-gold/25 bg-gold-light/20 px-5 py-4">
                <p className="flex items-center gap-2 text-sm font-medium text-gold-dark">
                  <Lock size={16} /> This course is locked
                </p>
                <p className="mt-1 text-sm text-ink-light">
                  Unlock it for one-time access — no subscription.
                </p>
                <Button
                  variant="gold"
                  size="lg"
                  className="mt-3"
                  onClick={handleUnlockClick}
                >
                  Unlock for ${course.price}
                </Button>
                {checkoutError && !paymentModalOpen && (
                  <p className="mt-2 text-sm text-danger">{checkoutError}</p>
                )}
              </div>
            )}
          </div>

          {hasContent && (
            <div className="mt-8 border-t border-line pt-8">
              <h2 className="font-display text-xl font-medium text-ink">Lesson content</h2>
              <div className="mt-4 space-y-4">
                {course.content.map((paragraph, i) => (
                  <p key={i} className="text-base leading-relaxed text-ink-light">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <PaymentModal
        open={paymentModalOpen}
        onClose={() => {
          setPaymentModalOpen(false)
          setCheckoutLoading(false)
        }}
        course={course}
        loading={checkoutLoading}
        error={checkoutError}
        onConfirm={handleConfirmPayment}
      />
    </div>
  )
}
