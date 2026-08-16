import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const role = await login(email, password)
      // A student who was sent here mid-checkout goes right back to that
      // course. Otherwise: students land on the catalog, admins on /admin.
      const redirectTo = location.state?.from
      if (redirectTo) {
        navigate(redirectTo)
      } else {
        navigate(role === 'admin' ? '/admin' : '/')
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not log in. Check your email and password.')
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-5 py-16 sm:px-8">
      <span className="font-mono text-xs uppercase tracking-widest text-gold-dark">
        Welcome back
      </span>
      <h1 className="mt-2 font-display text-3xl font-medium text-ink">Log in</h1>
      <p className="mt-2 text-sm text-ink-light">
        Students and admins both log in here — you'll land in the right place.
      </p>

      <Card className="mt-8 p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            id="email"
            type="email"
            label="Email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            id="password"
            type="password"
            label="Password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-sm text-danger">{error}</p>}
          <Button type="submit" variant="primary" size="lg" loading={loading} className="mt-2 w-full">
            Log in
          </Button>
        </form>
      </Card>

      <p className="mt-6 text-center text-sm text-ink-light">
        New here?{' '}
        <Link to="/signup" className="font-medium text-ink underline underline-offset-2">
          Create an account
        </Link>
      </p>
    </div>
  )
}
