import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSiteData } from '../context/SiteDataContext'

export default function AnnouncementBar() {
  const { siteContent: content } = useSiteData()
  const [dismissed, setDismissed] = useState(false)

  if (!content.announcement?.enabled || dismissed) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="relative bg-muted-rose/10 border-b border-muted-rose/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-center gap-3">
          <span className="text-xs sm:text-sm text-cream-white/80 text-center">
            {content.announcement.text}
          </span>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-soft-grey hover:text-cream-white transition-colors flex-shrink-0"
            aria-label="Dismiss announcement"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}