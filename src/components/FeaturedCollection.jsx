import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getProducts } from '../data/products'
import { getSiteContent } from '../data/siteContent'
import ProductImage from './ProductImage'

const products = getProducts()

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const cardAnim = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export default function FeaturedCollection() {
  const content = useMemo(() => getSiteContent(), [])
  const collection = content.collection || {}

  return (
    <section id="collection" className="relative py-24 lg:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6 }}
          className="text-center mb-16"
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

        <motion.div variants={container} initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {products.map((product) => (
            <motion.article key={product.id} variants={cardAnim}>
              <div className="group block bg-gradient-to-br rounded-2xl overflow-hidden border border-white/5 hover:border-muted-rose/20 transition-all duration-500">
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

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <a href="#order"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-rose hover:text-cream-white transition-colors"
          >
            {collection.ctaText}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
