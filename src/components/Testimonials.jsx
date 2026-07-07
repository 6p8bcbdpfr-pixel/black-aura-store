import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { getSiteContent } from '../data/siteContent'

function Stars({ count }) {
  return (
    <div className="flex gap-0.5 text-muted-rose">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} className={`w-4 h-4 ${i < count ? 'text-muted-rose' : 'text-soft-grey/20'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function Testimonials() {
  const content = useMemo(() => getSiteContent(), [])
  const { testimonials } = content

  if (!testimonials || testimonials.length === 0) return null

  return (
    <section className="py-24 px-6 border-t border-dark-border">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-muted-rose">
            Testimonials
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-heading font-light">
            What Our <span className="font-semibold text-muted-rose">Customers</span> Say
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="p-6 rounded-2xl bg-soft-grey-bg/50 border border-dark-border hover:border-muted-rose/10 transition-all"
            >
              <Stars count={t.rating} />
              <p className="mt-4 text-sm text-soft-grey leading-relaxed">&ldquo;{t.text}&rdquo;</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-muted-rose/15 flex items-center justify-center text-sm font-medium text-muted-rose">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-cream-white">{t.name}</p>
                  <p className="text-[10px] text-soft-grey">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}