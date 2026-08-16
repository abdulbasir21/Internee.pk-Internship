import { Link } from 'react-router-dom'
import { XCircle } from 'lucide-react'
import Button from '../components/ui/Button'

export default function PaymentCancel() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-5 py-24 text-center sm:px-8">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-danger-light text-danger">
        <XCircle size={32} />
      </div>
      <h1 className="mt-6 font-display text-3xl font-medium text-ink">Payment cancelled</h1>
      <p className="mt-3 text-sm text-ink-light">
        No charge was made. The course is still there whenever you're ready.
      </p>

      <Button as={Link} to="/" variant="primary" size="lg" className="mt-8">
        Back to catalog
      </Button>
    </div>
  )
}
