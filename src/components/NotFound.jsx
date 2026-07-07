import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-8xl sm:text-9xl font-heading font-light text-muted-rose/20"
        >
          404
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-4 text-lg text-soft-grey"
        >
          Page not found
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-2 text-sm text-soft-grey/60"
        >
          The page you are looking for does not exist.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-8"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-muted-rose text-deep-charcoal font-medium text-sm tracking-wider uppercase rounded-xl hover:bg-muted-rose/90 transition-all shadow-lg shadow-muted-rose/20"
          >
            Back to Home
          </Link>
        </motion.div>
      </div>
    </section>
  )
}