import { useMemo } from 'react'
import { getSiteContent } from '../data/siteContent'

export default function Footer() {
  const content = useMemo(() => getSiteContent(), [])
  const social = content.social || {}
  const footer = content.footer || {}

  const socialLinks = [
    { key: 'instagram', label: 'Ig' },
    { key: 'facebook', label: 'Fb' },
    { key: 'whatsapp', label: 'Wa' },
  ]

  return (
    <footer className="border-t border-dark-border">
      <div className="max-w-7xl mx-auto px-6 py-10 lg:py-14 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <p className="text-sm font-heading font-semibold tracking-widest uppercase text-cream-white">
          Black Aura
        </p>

        {/* Tagline */}
        <p className="text-xs text-soft-grey text-center">
          &copy; {new Date().getFullYear()} Black Aura. {footer.tagline}
        </p>

        {/* Social + Admin */}
        <div className="flex items-center gap-4">
          {socialLinks.map((s) => (
            <a key={s.key} href={social[s.key] || '#'} target="_blank" rel="noopener noreferrer"
              className="text-xs font-medium text-soft-grey/50 hover:text-muted-rose transition-colors"
            >{s.label}</a>
          ))}
          <span className="text-soft-grey/20">|</span>
          <a href="/admin/login"
            className="text-xs text-soft-grey/40 hover:text-muted-rose transition-colors"
          >Admin</a>
        </div>
      </div>
    </footer>
  )
}
