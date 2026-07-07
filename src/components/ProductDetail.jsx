import { useState, useRef, useMemo, useEffect } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getProductBySlug } from '../data/products'
import { GOVERNORATES, PAYMENT_METHODS, calcShipping } from '../data/egypt'
import { getSiteContent } from '../data/siteContent'
import { submitOrder } from '../lib/db'
import ProductImage, { isUploadedImage } from './ProductImage'

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  address: '',
  governorate: '',
  quantity: 1,
  paymentMethod: 'vodafone',
  notes: '',
}

export default function ProductDetail() {
  const { slug } = useParams()
  const location = useLocation()
  const product = getProductBySlug(slug)
  const settings = useMemo(() => getSiteContent(), [])

  const [activeImg, setActiveImg] = useState(0)
  const [selectedSize, setSelectedSize] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [receipt, setReceipt] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [showForm, setShowForm] = useState(location.state?.autoShowForm === true)
  const fileRef = useRef(null)

  const shipping = useMemo(
    () => calcShipping(form.governorate, settings),
    [form.governorate, settings]
  )

  if (!product) {
    return (
      <section className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-4xl font-heading font-light text-cream-white mb-4">Product Not Found</h1>
          <Link to="/" className="inline-block text-sm text-muted-rose hover:text-cream-white transition-colors">&larr; Back to Collection</Link>
        </div>
      </section>
    )
  }

  const handleChange = (e) => {
    const { name, value, type } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'number' ? Number(value) : value }))
  }

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (file) setReceipt(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const order = {
      ...form,
      product: product.name,
      size: selectedSize,
      shipping,
      receipt: receipt ? receipt.name : null,
      date: new Date().toLocaleString('en-EG'),
    }
    const existing = JSON.parse(localStorage.getItem('ba_orders') || '[]')
    existing.unshift(order)
    localStorage.setItem('ba_orders', JSON.stringify(existing))
    try { await submitOrder(order) } catch {}
    setSubmitted(true)
    setForm(emptyForm)
    setReceipt(null)
    setSelectedSize(null)
    if (fileRef.current) fileRef.current.value = ''
    setTimeout(() => setSubmitted(false), 5000)
  }

  const payInfo = PAYMENT_METHODS[form.paymentMethod]
  const pm = settings.payment

  return (
    <section className="min-h-screen pt-28 lg:pt-36 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* ─── Back Link ─── */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-soft-grey hover:text-muted-rose transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Back to Collection
          </Link>
        </motion.div>

        {/* ─── Product Info + Order Form ─── */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* ─── Left: Images ─── */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="mb-4 border border-dark-border rounded-2xl overflow-hidden">
              <ProductImage src={product.images[activeImg]} alt={product.name} aspect="aspect-[4/5]" padding rounded="rounded-2xl" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`rounded-xl overflow-hidden border transition-all duration-300 ${
                    activeImg === i ? 'border-muted-rose ring-1 ring-muted-rose/30' : 'border-dark-border hover:border-muted-rose/30'
                  }`}
                >
                  {isUploadedImage(img) ? (
                    <div className="aspect-square"><img src={img} alt="" className="w-full h-full object-cover" /></div>
                  ) : (
                    <div className={`aspect-square bg-gradient-to-br ${img} flex items-center justify-center p-3`}>
                      <div className="w-full h-full rounded-lg bg-white/5 backdrop-blur-sm flex items-center justify-center">
                        <svg className="w-5 h-5 text-soft-grey/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>

          {/* ─── Right: Product Info ─── */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-muted-rose">{product.category}</span>
            <h1 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-heading font-light text-cream-white leading-tight">{product.name}</h1>
            <p className="mt-4 text-2xl font-medium text-muted-rose">{product.price}</p>

            <p className="mt-6 text-soft-grey leading-relaxed text-sm sm:text-base">{product.description}</p>

            {/* Sizes */}
            <div className="mt-8">
              <h3 className="text-sm font-medium text-cream-white mb-3">Size</h3>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button key={size} onClick={() => setSelectedSize(size)}
                    className={`px-5 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 ${
                      selectedSize === size
                        ? 'border-muted-rose bg-muted-rose/10 text-muted-rose'
                        : 'border-dark-border text-soft-grey hover:border-muted-rose/30 hover:text-cream-white'
                    }`}
                  >{size}</button>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="mt-8">
              <h3 className="text-sm font-medium text-cream-white mb-3">Details</h3>
              <ul className="space-y-2">
                {product.details.map((detail, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-soft-grey">
                    <span className="text-muted-rose/60 mt-0.5">&#10003;</span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>

            {/* ─── Order Now / Show Form ─── */}
            {!showForm ? (
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <button onClick={() => setShowForm(true)}
                  className="flex-1 text-center px-8 py-3.5 bg-muted-rose text-deep-charcoal font-medium text-sm tracking-wider uppercase rounded-xl hover:bg-muted-rose/90 transition-all shadow-lg shadow-muted-rose/20 active:scale-[0.98]"
                >Order Now</button>
                <Link to="/#collection"
                  className="flex-1 text-center px-8 py-3.5 border border-soft-grey/30 text-cream-white font-medium text-sm tracking-wider uppercase rounded-xl hover:border-muted-rose/50 hover:text-muted-rose transition-all"
                >Continue Shopping</Link>
              </div>
            ) : (
              /* ─── Inline Order Form ─── */
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-6 rounded-2xl border border-dark-border bg-soft-grey-bg/60">
                <h3 className="text-sm font-medium text-cream-white mb-5">Complete Your Order</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name + Phone */}
                  <input name="name" required value={form.name} onChange={handleChange} placeholder="Full Name *"
                    className="w-full px-4 py-3 bg-deep-charcoal border border-dark-border rounded-xl text-cream-white text-sm placeholder-soft-grey/50 focus:outline-none focus:border-muted-rose/50 focus:ring-1 focus:ring-muted-rose/20 transition-all" />
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input name="email" type="email" required value={form.email} onChange={handleChange} placeholder="Email *"
                      className="w-full px-4 py-3 bg-deep-charcoal border border-dark-border rounded-xl text-cream-white text-sm placeholder-soft-grey/50 focus:outline-none focus:border-muted-rose/50 focus:ring-1 focus:ring-muted-rose/20 transition-all" />
                    <input name="phone" type="tel" required value={form.phone} onChange={handleChange} placeholder="Phone *"
                      className="w-full px-4 py-3 bg-deep-charcoal border border-dark-border rounded-xl text-cream-white text-sm placeholder-soft-grey/50 focus:outline-none focus:border-muted-rose/50 focus:ring-1 focus:ring-muted-rose/20 transition-all" />
                  </div>

                  {/* Address */}
                  <textarea name="address" required value={form.address} onChange={handleChange} placeholder="Full Address (street, building, apartment) *" rows={2}
                    className="w-full px-4 py-3 bg-deep-charcoal border border-dark-border rounded-xl text-cream-white text-sm placeholder-soft-grey/50 focus:outline-none focus:border-muted-rose/50 focus:ring-1 focus:ring-muted-rose/20 transition-all resize-none" />

                  {/* Governorate */}
                  <select name="governorate" required value={form.governorate} onChange={handleChange}
                    className="w-full px-4 py-3 bg-deep-charcoal border border-dark-border rounded-xl text-cream-white text-sm focus:outline-none focus:border-muted-rose/50 focus:ring-1 focus:ring-muted-rose/20 transition-all appearance-none"
                  >
                    <option value="">Select Governorate *</option>
                    {GOVERNORATES.map((g) => (<option key={g} value={g}>{g}</option>))}
                  </select>

                  {/* Shipping estimate */}
                  {form.governorate && (
                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-xl bg-deep-charcoal border border-dark-border text-sm flex items-center justify-between"
                    >
                      <span className="text-soft-grey">Shipping to <span className="text-cream-white">{form.governorate}</span></span>
                      <span className="text-muted-rose font-medium">{shipping === 0 ? 'Free' : `EGP ${shipping}`}</span>
                    </motion.div>
                  )}

                  {/* Quantity */}
                  <input name="quantity" type="number" min={1} value={form.quantity} onChange={handleChange}
                    className="w-full px-4 py-3 bg-deep-charcoal border border-dark-border rounded-xl text-cream-white text-sm focus:outline-none focus:border-muted-rose/50 focus:ring-1 focus:ring-muted-rose/20 transition-all" />

                  {/* Payment */}
                  <div>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(PAYMENT_METHODS).map(([key, info]) => (
                        <label key={key}
                          className={`flex items-center justify-center px-3 py-2.5 rounded-xl border cursor-pointer transition-all text-xs ${
                            form.paymentMethod === key
                              ? 'border-muted-rose bg-muted-rose/10 text-muted-rose'
                              : 'border-dark-border bg-deep-charcoal text-soft-grey hover:border-muted-rose/30'
                          }`}
                        >
                          <input type="radio" name="paymentMethod" value={key} checked={form.paymentMethod === key} onChange={handleChange} className="sr-only" />
                          {info.label}
                        </label>
                      ))}
                    </div>
                    <AnimatePresence mode="wait">
                      {payInfo && (
                        <motion.p key={form.paymentMethod} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                          className="mt-1.5 text-xs text-soft-grey"
                        >
                          {payInfo.tip}{' '}
                          {payInfo.details && <span className="text-muted-rose/80 font-medium">{payInfoKeyDisplay(form.paymentMethod, pm)}</span>}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Receipt */}
                  {payInfo?.hasReceipt && (
                    <div>
                      <input ref={fileRef} type="file" accept="image/*,.pdf" onChange={handleFile}
                        className="w-full text-xs text-soft-grey file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-medium file:bg-muted-rose/10 file:text-muted-rose file:cursor-pointer hover:file:bg-muted-rose/20 transition-all cursor-pointer" />
                      {receipt && <p className="mt-1 text-xs text-muted-rose/80">&#10003; {receipt.name}</p>}
                    </div>
                  )}

                  {/* Notes */}
                  <textarea name="notes" rows={1} value={form.notes} onChange={handleChange} placeholder="Additional notes..."
                    className="w-full px-4 py-3 bg-deep-charcoal border border-dark-border rounded-xl text-cream-white text-sm placeholder-soft-grey/50 focus:outline-none focus:border-muted-rose/50 focus:ring-1 focus:ring-muted-rose/20 transition-all resize-none" />

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <button type="submit"
                      className="flex-1 py-3 bg-muted-rose text-deep-charcoal font-medium text-sm tracking-wider uppercase rounded-xl hover:bg-muted-rose/90 transition-all shadow-lg shadow-muted-rose/20 active:scale-[0.98]"
                    >Submit Order</button>
                    <button type="button" onClick={() => setShowForm(false)}
                      className="px-4 py-3 text-sm text-soft-grey border border-dark-border rounded-xl hover:border-muted-rose/30 hover:text-cream-white transition-all"
                    >Cancel</button>
                  </div>

                  <AnimatePresence>
                    {submitted && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="p-3 rounded-xl bg-muted-rose/10 border border-muted-rose/20 text-center"
                      >
                        <p className="text-sm text-muted-rose font-medium">&#10003; Order placed! We will contact you shortly.</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function payInfoKeyDisplay(key, pm) {
  if (key === 'vodafone') return pm?.vodafoneNumber || ''
  if (key === 'instapay') return pm?.instapayUser || ''
  if (key === 'bank') return pm?.bankDetails || ''
  return ''
}
