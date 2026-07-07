import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSiteData } from '../context/SiteDataContext'
import ProductImage from './ProductImage'

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const cardAnim = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export default function CollectionPage() {
  const { products, siteContent } = useSiteData()
  const { collection } = siteContent
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category))]
    return ['All', ...cats]
  }, [])

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
      const matchCategory = activeCategory === 'All' || p.category === activeCategory
      return matchSearch && matchCategory
    })
  }, [search, activeCategory])

  return (
    <section className="min-h-screen pt-28 lg:pt-36 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-muted-rose">
            {collection.badge}
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-heading font-light">
            {collection.title}
            <span className="font-semibold text-muted-rose">{collection.titleAccent}</span>
          </h2>
          <p className="mt-4 max-w-lg mx-auto text-soft-grey text-sm sm:text-base">
            {collection.description}
          </p>
        </motion.div>

        {/* ─── Search + Category Filter ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-10 space-y-4"
        >
          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-soft-grey/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-soft-grey-bg/60 border border-dark-border rounded-xl text-cream-white text-sm placeholder-soft-grey/50 focus:outline-none focus:border-muted-rose/50 focus:ring-1 focus:ring-muted-rose/20 transition-all"
            />
          </div>

          {/* Category chips */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs font-medium rounded-full border transition-all ${
                  activeCategory === cat
                    ? 'bg-muted-rose/10 border-muted-rose text-muted-rose'
                    : 'border-dark-border text-soft-grey hover:border-muted-rose/30 hover:text-cream-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ─── Results ─── */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-soft-grey text-sm">No products match your search.</p>
          </motion.div>
        ) : (
          <motion.div variants={container} initial="hidden" animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {filtered.map((product) => (
              <motion.article key={product.id} variants={cardAnim}>
                <div className="group bg-gradient-to-br rounded-2xl overflow-hidden border border-white/5 hover:border-muted-rose/20 transition-all duration-500">
                  <Link to={`/product/${product.slug}`}>
                    <ProductImage src={product.images[0]} alt={product.name} padding rounded="rounded-t-2xl" />
                  </Link>
                  <div className="p-4 sm:p-5">
                    <span className="text-[10px] font-medium tracking-widest uppercase text-muted-rose/70">{product.category}</span>
                    <Link to={`/product/${product.slug}`}>
                      <h3 className="mt-1 text-sm sm:text-base font-medium text-cream-white hover:text-muted-rose transition-colors">{product.name}</h3>
                    </Link>
                    <p className="mt-1 text-sm text-soft-grey">{product.price}</p>
                    <Link to={`/product/${product.slug}`} state={{ autoShowForm: true }}
                      className="mt-3 w-full block text-center px-4 py-2.5 bg-muted-rose text-deep-charcoal font-medium text-xs tracking-wider uppercase rounded-xl hover:bg-muted-rose/90 transition-all shadow-lg shadow-muted-rose/20 active:scale-[0.98]"
                    >
                      Order Now
                    </Link>
                  </div>
                  <div className="absolute inset-0 bg-muted-rose/0 group-hover:bg-muted-rose/5 transition-all pointer-events-none" />
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}