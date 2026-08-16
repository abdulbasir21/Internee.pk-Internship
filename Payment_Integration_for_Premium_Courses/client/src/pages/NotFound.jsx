import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-5 py-24 text-center sm:px-8">
      <span className="font-display text-6xl text-ink-faint">404</span>
      <h1 className="mt-4 font-display text-2xl font-medium text-ink">Page not found</h1>
      <p className="mt-2 text-sm text-ink-light">That page doesn't exist, or moved.</p>
      <Button as={Link} to="/" variant="primary" className="mt-6">
        Back to catalog
      </Button>
    </div>
  )
}
