import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      // Signup always comes back as a student — there is no admin signup.
      await signup(name, email, password)
      navigate('/')
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not create your account. Try again.')
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-5 py-16 sm:px-8">
      <span className="font-mono text-xs uppercase tracking-widest text-gold-dark">
        Get started
      </span>
      <h1 className="mt-2 font-display text-3xl font-medium text-ink">Create your account</h1>
      <p className="mt-2 text-sm text-ink-light">
        Free courses open right away. Premium ones unlock the moment you check out.
      </p>

      <Card className="mt-8 p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            id="name"
            label="Name"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-sm text-danger">{error}</p>}
          <Button type="submit" variant="primary" size="lg" loading={loading} className="mt-2 w-full">
            Create account
          </Button>
        </form>
      </Card>

      <p className="mt-6 text-center text-sm text-ink-light">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-ink underline underline-offset-2">
          Log in
        </Link>
      </p>
    </div>
  )
}
