import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (login(password)) {
      navigate('/admin')
    } else {
      setError(true)
      setPassword('')
      setTimeout(() => setError(false), 2500)
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center px-6 bg-deep-charcoal">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm"
      >
        {/* ─── Header ─── */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-heading font-light text-cream-white">
            Admin <span className="font-semibold text-muted-rose">Panel</span>
          </h1>
          <p className="mt-2 text-xs text-soft-grey">Enter password to continue</p>
        </div>

        {/* ─── Form ─── */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoFocus
              className={`w-full px-4 py-3 bg-soft-grey-bg border rounded-xl text-cream-white text-sm placeholder-soft-grey/50 focus:outline-none focus:ring-1 transition-all ${
                error
                  ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
                  : 'border-dark-border focus:border-muted-rose/50 focus:ring-muted-rose/20'
              }`}
            />
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1.5 text-xs text-red-400"
              >
                Incorrect password
              </motion.p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-muted-rose text-deep-charcoal font-medium text-sm tracking-wider uppercase rounded-xl hover:bg-muted-rose/90 transition-all duration-300 shadow-lg shadow-muted-rose/20 active:scale-[0.98]"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center">
          <a href="/" className="text-xs text-soft-grey hover:text-muted-rose transition-colors">
            &larr; Back to site
          </a>
        </p>
      </motion.div>
    </section>
  )
}
