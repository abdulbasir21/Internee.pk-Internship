import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, GraduationCap } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Button from '../ui/Button'

export default function Navbar() {
  const { isAuthenticated, role, user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setOpen(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
          <GraduationCap size={22} className="text-gold" strokeWidth={2} />
          Coursebound
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 sm:flex">
          <Link to="/" className="text-sm font-medium text-ink-light transition-colors hover:text-ink">
            Catalog
          </Link>
          {isAuthenticated && role === 'student' && (
            <Link
              to="/my-courses"
              className="text-sm font-medium text-ink-light transition-colors hover:text-ink"
            >
              My Courses
            </Link>
          )}
          {isAuthenticated && role === 'admin' && (
            <Link to="/admin" className="text-sm font-medium text-ink-light transition-colors hover:text-ink">
              Admin
            </Link>
          )}

          {!isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-medium text-ink-light transition-colors hover:text-ink">
                Log in
              </Link>
              <Button as={Link} to="/signup" variant="gold" size="sm">
                Sign up
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3 border-l border-line pl-6">
              <span className="text-sm text-ink-light">
                Hi, <span className="font-medium text-ink">{user?.name?.split(' ')[0] || 'there'}</span>
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Log out
              </Button>
            </div>
          )}
        </nav>

        {/* Mobile toggle */}
        <button
          className="rounded-lg p-2 text-ink sm:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="flex flex-col gap-1 border-t border-line/70 bg-paper px-5 pb-5 pt-3 sm:hidden">
          <Link to="/" onClick={() => setOpen(false)} className="rounded-lg px-2 py-2.5 text-sm font-medium text-ink">
            Catalog
          </Link>
          {isAuthenticated && role === 'student' && (
            <Link
              to="/my-courses"
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-2.5 text-sm font-medium text-ink"
            >
              My Courses
            </Link>
          )}
          {isAuthenticated && role === 'admin' && (
            <Link to="/admin" onClick={() => setOpen(false)} className="rounded-lg px-2 py-2.5 text-sm font-medium text-ink">
              Admin
            </Link>
          )}
          {!isAuthenticated ? (
            <div className="mt-2 flex flex-col gap-2">
              <Button as={Link} to="/login" variant="ghost" onClick={() => setOpen(false)}>
                Log in
              </Button>
              <Button as={Link} to="/signup" variant="gold" onClick={() => setOpen(false)}>
                Sign up
              </Button>
            </div>
          ) : (
            <Button variant="ghost" className="mt-2" onClick={handleLogout}>
              Log out
            </Button>
          )}
        </nav>
      )}
    </header>
  )
}
