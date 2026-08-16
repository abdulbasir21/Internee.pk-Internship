import { CreditCard, ShieldCheck } from 'lucide-react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'

// The "payment area" — opens when a student clicks Unlock. Shows an order
// summary and hands off to Stripe Checkout only once they confirm here.
// Stripe itself still collects the card details on its hosted page; this
// modal is the in-app step right before that handoff.
export default function PaymentModal({ open, onClose, course, loading, error, onConfirm }) {
  if (!course) return null

  return (
    <Modal open={open} onClose={onClose} title="Complete your purchase" className="max-w-md">
      <div className="space-y-5">
        <div className="rounded-lg border border-line bg-paper px-4 py-3">
          <p className="text-xs font-mono uppercase tracking-wide text-ink-faint">Course</p>
          <p className="mt-1 font-display text-base font-medium text-ink">{course.title}</p>
        </div>

        <div className="flex items-center gap-3 rounded-lg border border-gold/30 bg-gold-light/20 px-4 py-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-dark">
            <CreditCard size={17} />
          </div>
          <div>
            <p className="text-sm font-medium text-ink">Pay with card</p>
            <p className="text-xs text-ink-light">You'll enter card details on Stripe's secure checkout</p>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-paper px-4 py-3">
          <span className="text-sm text-ink-light">Total</span>
          <span className="font-display text-lg font-medium text-ink">${course.price}</span>
        </div>

        {error && (
          <p className="rounded-lg border border-danger/25 bg-danger-light px-3 py-2 text-sm text-danger">
            {error}
          </p>
        )}

        <Button variant="gold" size="lg" className="w-full" loading={loading} onClick={onConfirm}>
          Proceed to payment
        </Button>

        <p className="flex items-center justify-center gap-1.5 text-xs text-ink-faint">
          <ShieldCheck size={13} /> Secure checkout powered by Stripe
        </p>
      </div>
    </Modal>
  )
}
