/* ─── Product Data ─── */
/* Edit this file to add, remove, or update products */

export const defaultProducts = [
  {
    id: 1,
    slug: 'obsidian-tote',
    name: 'Obsidian Tote',
    category: 'Handbags',
    price: 'EGP 2,450',
    description:
      'A spacious everyday tote crafted from premium vegan leather. Features a magnetic closure, interior zip pocket, and reinforced handles for lasting elegance.',
    sizes: ['One Size'],
    images: [
      'from-zinc-800 to-zinc-900',
      'from-zinc-700 to-zinc-800',
      'from-zinc-800 to-zinc-900',
    ],
    details: ['Vegan leather exterior', 'Magnetic snap closure', 'Interior zip pocket', 'Gold-toned hardware', 'Dimensions: 38 x 30 x 12 cm'],
  },
  {
    id: 2,
    slug: 'noir-chain-bracelet',
    name: 'Noir Chain Bracelet',
    category: 'Jewelry',
    price: 'EGP 890',
    description:
      'A delicate chain bracelet with an adjustable clasp. The perfect layering piece to elevate any outfit with a touch of subdued shine.',
    sizes: ['S (16cm)', 'M (18cm)', 'L (20cm)'],
    images: [
      'from-zinc-700 to-zinc-800',
      'from-zinc-800 to-zinc-900',
      'from-zinc-700 to-zinc-800',
    ],
    details: ['Hypoallergenic stainless steel', 'Adjustable clasp', 'Tarnish-resistant finish', 'Weight: 4.2g'],
  },
  {
    id: 3,
    slug: 'aura-sunglasses',
    name: 'Aura Sunglasses',
    category: 'Eyewear',
    price: 'EGP 1,290',
    description:
      'Oversized cat-eye frames with UV400 protection. Designed to make a statement while keeping your vision crisp and your look effortlessly chic.',
    sizes: ['One Size'],
    images: [
      'from-zinc-800 to-zinc-900',
      'from-zinc-700 to-zinc-800',
      'from-zinc-800 to-zinc-900',
    ],
    details: ['UV400 protection', 'Lightweight acetate frame', 'Crystal-clear lenses', 'Includes hard case & microfiber cloth'],
  },
  {
    id: 4,
    slug: 'silk-scarf-dusty-rose',
    name: 'Silk Scarf — Dusty Rose',
    category: 'Scarves',
    price: 'EGP 1,150',
    description:
      'A luxurious mulberry silk scarf in our signature dusty rose hue. Wear it around your neck, tie it on your bag, or style it in your hair.',
    sizes: ['90 x 90 cm'],
    images: [
      'from-muted-rose/20 to-dusty-lavender/10',
      'from-muted-rose/20 to-zinc-800',
      'from-dusty-lavender/20 to-zinc-800',
    ],
    details: ['100% mulberry silk', 'Hand-rolled edges', 'Digital print', 'Dry clean only'],
  },
  {
    id: 5,
    slug: 'minimalist-watch',
    name: 'Minimalist Watch',
    category: 'Watches',
    price: 'EGP 3,200',
    description:
      'A slim-profile timepiece with a sunburst dial and Italian leather strap. Minimalist design meets precision quartz movement.',
    sizes: ['S (14cm)', 'M (16cm)', 'L (18cm)'],
    images: [
      'from-zinc-700 to-zinc-800',
      'from-zinc-800 to-zinc-900',
      'from-zinc-700 to-zinc-800',
    ],
    details: ['Quartz movement', 'Italian leather strap', 'Mineral crystal glass', 'Water resistant (3 ATM)', 'Japanese mechanism'],
  },
  {
    id: 6,
    slug: 'leather-cardholder',
    name: 'Leather Cardholder',
    category: 'Accessories',
    price: 'EGP 680',
    description:
      'Slim RFID-blocking cardholder crafted from full-grain leather. Holds up to 6 cards while maintaining a sleek, pocket-friendly profile.',
    sizes: ['One Size'],
    images: [
      'from-zinc-800 to-zinc-900',
      'from-zinc-700 to-zinc-800',
      'from-zinc-800 to-zinc-900',
    ],
    details: ['Full-grain leather', 'RFID blocking', 'Holds 6 cards', 'Slim profile: 1 cm thick', 'Embossed logo'],
  },
]

/* ─── Storage key ─── */
export const STORAGE_KEY = 'ba_products'

/* ─── Read products from localStorage, fallback to defaults ─── */
export function getProducts() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch {}
  return [...defaultProducts]
}

/* ─── Save products to localStorage ─── */
export function saveProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
}

/* ─── Reset products to defaults ─── */
export function resetProducts() {
  localStorage.removeItem(STORAGE_KEY)
  return [...defaultProducts]
}

/* ─── Find a product by slug ─── */
export function getProductBySlug(slug) {
  const products = getProducts()
  return products.find((p) => p.slug === slug) || null
}
