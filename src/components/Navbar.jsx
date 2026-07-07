import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getSiteContent } from '../data/siteContent'

const navLinks = ['Home', 'Collection', 'About', 'Order']

export default function Navbar() {
  const content = useMemo(() => getSiteContent(), [])
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isHome = location.pathname === '/'
  const hasLogo = content.images.logo && content.images.logo.startsWith('data:image')

  const handleNav = (id) => {
    setMenuOpen(false)
    const sectionId = id.toLowerCase()
    if (sectionId === 'collection') {
      navigate('/collection')
    } else if (isHome) {
      const el = document.getElementById(sectionId)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/#' + sectionId)
    }
  }

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass shadow-lg' : 'bg-transparent'}`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-16 lg:h-20">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-lg lg:text-xl font-heading font-semibold tracking-widest uppercase text-cream-white">
          {hasLogo ? (
            <img src={content.images.logo} alt="Black Aura" className="h-8 lg:h-10 w-auto object-contain" />
          ) : (
            'Black Aura'
          )}
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link}>
              <button onClick={() => handleNav(link)}
                className="text-sm font-medium text-soft-grey hover:text-muted-rose transition-colors tracking-wide"
              >{link}</button>
            </li>
          ))}
        </ul>

        {/* Mobile Hamburger */}
        <button aria-label="Toggle menu" className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className={`block h-0.5 w-6 bg-cream-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block h-0.5 w-6 bg-cream-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-6 bg-cream-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass overflow-hidden"
          >
            <ul className="flex flex-col items-center gap-6 py-8">
              {navLinks.map((link) => (
                <motion.li key={link} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * navLinks.indexOf(link) }}
                >
                  <button onClick={() => handleNav(link)}
                    className="text-base font-medium text-cream-white hover:text-muted-rose transition-colors tracking-wide"
                  >{link}</button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
