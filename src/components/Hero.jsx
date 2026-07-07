import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { getSiteContent } from '../data/siteContent'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.15 },
  }),
}

export default function Hero() {
  const content = useMemo(() => getSiteContent(), [])
  const { hero, images } = content
  const hasBg = images.heroBg && images.heroBg.startsWith('data:image')

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* ─── Background ─── */}
      {hasBg ? (
        <>
          <img src={images.heroBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-deep-charcoal/60" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-soft-grey-bg/40 via-deep-charcoal to-deep-charcoal pointer-events-none" />
      )}

      {/* ─── Decorative Circles ─── */}
      <div className="absolute top-20 -left-20 w-72 h-72 rounded-full bg-muted-rose/5 blur-3xl" />
      <div className="absolute bottom-20 -right-20 w-96 h-96 rounded-full bg-dusty-lavender/5 blur-3xl" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">

        {/* Badge */}
        <motion.span variants={fadeUp} initial="hidden" animate="visible" custom={0}
          className="inline-block mb-6 px-5 py-2 text-xs font-medium tracking-[0.2em] uppercase text-muted-rose border border-muted-rose/20 rounded-full"
        >{hero.badge}</motion.span>

        {/* Headline */}
        <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-light leading-tight mb-6"
        >
          {hero.headline}
          <span className="font-semibold text-muted-rose">{hero.headlineAccent}</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
          className="max-w-xl mx-auto text-soft-grey text-base sm:text-lg leading-relaxed mb-10"
        >{hero.subheadline}</motion.p>

        {/* CTA Buttons */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a href="#collection"
            className="px-8 py-3.5 bg-muted-rose text-deep-charcoal font-medium text-sm tracking-wider uppercase rounded-full hover:bg-muted-rose/90 transition-all shadow-lg shadow-muted-rose/20"
          >{hero.ctaText || 'Explore Collection'}</a>
          <a href="#order"
            className="px-8 py-3.5 border border-soft-grey/30 text-cream-white font-medium text-sm tracking-wider uppercase rounded-full hover:border-muted-rose/50 hover:text-muted-rose transition-all"
          >{hero.ctaSecondaryText || 'Place Order'}</a>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="w-5 h-8 border border-soft-grey/30 rounded-full flex justify-center pt-2"
        >
          <div className="w-1 h-2 bg-muted-rose rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}
