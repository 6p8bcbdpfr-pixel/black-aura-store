import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { getSiteContent } from '../data/siteContent'

const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export default function About() {
  const content = useMemo(() => getSiteContent(), [])
  const about = content.about || {}
  const images = content.images || {}
  const values = content.values || []
  const hasAboutImg = images.aboutImage && images.aboutImage.startsWith('data:image')

  return (
    <section id="about" className="relative py-24 lg:py-32 px-6">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-dark-border to-transparent" />

      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left */}
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-3xl bg-gradient-to-br from-soft-grey-bg to-deep-charcoal border border-dark-border overflow-hidden flex items-center justify-center">
              {hasAboutImg ? (
                <img src={images.aboutImage} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-8">
                  <span className="text-6xl sm:text-7xl font-heading font-light text-muted-rose/20">BA</span>
                  <div className="mt-4 w-16 h-px bg-muted-rose/30 mx-auto" />
                  <p className="mt-4 text-xs tracking-[0.3em] uppercase text-soft-grey/40">{about.year}</p>
                </div>
              )}
            </div>
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-muted-rose/10 blur-2xl pointer-events-none" />
          </motion.div>

          {/* Right */}
          <div className="space-y-8">
            <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
              <span className="text-xs font-medium tracking-[0.2em] uppercase text-muted-rose">{about.badge}</span>
              <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-heading font-light leading-tight">
                {about.headline}<span className="font-semibold text-muted-rose">{about.headlineAccent}</span>{about.headlineEnd}
              </h2>
              <p className="mt-5 text-soft-grey leading-relaxed text-sm sm:text-base">{about.paragraph}</p>
            </motion.div>

            <div className="space-y-5">
              {values.map((item, i) => (
                <motion.div key={item.title} initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: i * 0.12, duration: 0.5 }}
                  className="flex gap-4 p-4 rounded-xl bg-soft-grey-bg/50 border border-dark-border hover:border-muted-rose/10 transition-all"
                >
                  <span className="text-xl text-muted-rose/70 flex-shrink-0 mt-0.5">{item.icon}</span>
                  <div>
                    <h4 className="text-sm font-semibold text-cream-white">{item.title}</h4>
                    <p className="mt-1 text-xs text-soft-grey leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
