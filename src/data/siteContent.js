/* ─── Site Content — edit defaults here ─── */
/* Admin panel changes are saved to localStorage under "ba_siteContent" */

export const defaultContent = {
  images: {
    logo: '',
    heroBg: '',
    aboutImage: '',
  },
  hero: {
    badge: 'New Collection 2026',
    headline: 'Elegance in ',
    headlineAccent: 'Every Detail',
    subheadline:
      'Discover handcrafted accessories that blend modern minimalism with timeless sophistication. Made for the woman who leads with grace.',
    ctaText: 'Explore Collection',
    ctaSecondaryText: 'Place Order',
  },
  about: {
    badge: 'Our Story',
    headline: 'Where ',
    headlineAccent: 'Dark',
    headlineEnd: ' Meets Delicate',
    paragraph:
      'Black Aura was born from a simple belief: that modern elegance should feel both powerful and soft. We craft accessories for women who appreciate clean lines, muted tones, and the quiet confidence of understated luxury.',
    year: 'Since 2024',
  },
  collection: {
    badge: 'Curated for you',
    title: 'Featured ',
    titleAccent: 'Collection',
    description:
      'Each piece is thoughtfully designed to complement your everyday elegance.',
    ctaText: 'View Full Catalog',
  },
  contact: {
    email: 'hello@blackaura.com',
    phone: '+20 100 123 4567',
    workingHours: 'Sat–Thu, 10 AM – 8 PM',
  },
  social: {
    instagram: 'https://instagram.com/blackaura',
    facebook: 'https://facebook.com/blackaura',
    whatsapp: 'https://wa.me/201001234567',
  },
  footer: {
    tagline: 'All rights reserved.',
  },
  announcement: {
    enabled: true,
    text: 'Free shipping on orders over EGP 1,000 🚚',
  },
  testimonials: [
    {
      name: 'Nadine A.',
      role: 'Verified Buyer',
      text: 'The quality exceeded my expectations. My Obsidian Tote is absolutely stunning and the leather feels premium.',
      rating: 5,
    },
    {
      name: 'Mariam K.',
      role: 'Verified Buyer',
      text: 'I receive compliments everywhere I go with my Noir Chain Bracelet. The packaging was beautiful too!',
      rating: 5,
    },
    {
      name: 'Laila H.',
      role: 'Verified Buyer',
      text: 'Fast delivery and the Silk Scarf is even more gorgeous in person. Will definitely order again.',
      rating: 5,
    },
  ],
  shipping: {
    alexandria: '45',
    outside: '80',
    freeThreshold: '0',
  },
  payment: {
    vodafoneNumber: '0100 123 4567',
    instapayUser: '@BlackAuraShop',
    bankDetails: 'CIB — 1000123456',
  },
  values: [
    {
      title: 'Handcrafted Quality',
      desc: 'Every piece is meticulously crafted by skilled artisans using premium materials sourced from around the world.',
      icon: '\u2726',
    },
    {
      title: 'Timeless Design',
      desc: 'We believe in slow fashion. Our designs transcend seasons, built to be cherished for years to come.',
      icon: '\u25C8',
    },
    {
      title: 'Empowered Womanhood',
      desc: 'Black Aura is more than accessories \u2014 it is a celebration of confidence, grace, and individuality.',
      icon: '\u2661',
    },
  ],
}

const STORAGE_KEY = 'ba_siteContent'

export function getSiteContent() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return deepMerge(defaultContent, parsed)
    }
  } catch {}
  return deepMerge(defaultContent, {})
}

export function saveSiteContent(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function resetSiteContent() {
  localStorage.removeItem(STORAGE_KEY)
  return deepMerge(defaultContent, {})
}

export function deepMerge(base, override) {
  const result = { ...base }
  for (const key of Object.keys(override)) {
    if (
      base[key] &&
      typeof base[key] === 'object' &&
      !Array.isArray(base[key]) &&
      typeof override[key] === 'object' &&
      override[key] !== null &&
      !Array.isArray(override[key])
    ) {
      result[key] = deepMerge(base[key], override[key])
    } else {
      result[key] = override[key] !== undefined ? override[key] : base[key]
    }
  }
  return result
}

/* ─── Image compressor (reused in admin) ─── */
export function compressImage(file, maxWidth = 1200, quality = 0.92) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (ev) => {
      const img = new Image()
      img.onload = () => {
        let w = img.width
        let h = img.height
        if (w > maxWidth) {
          h = Math.round((h * maxWidth) / w)
          w = maxWidth
        }
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.onerror = reject
      img.src = ev.target.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
