import { useState, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GOVERNORATES, PAYMENT_METHODS, calcShipping } from '../data/egypt'
import { useSiteData } from '../context/SiteDataContext'
import { submitOrder } from '../lib/db'

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  address: '',
  governorate: '',
  product: '',
  quantity: 1,
  paymentMethod: 'vodafone',
  notes: '',
}

export default function ContactOrder() {
  const { products, siteContent } = useSiteData()
  const settings = siteContent
  const [form, setForm] = useState(emptyForm)
  const [receipt, setReceipt] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const fileRef = useRef(null)

  const shipping = useMemo(
    () => calcShipping(form.governorate, settings),
    [form.governorate, settings]
  )

  const handleChange = (e) => {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }))
  }

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (file) setReceipt(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const order = {
      ...form,
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
    if (fileRef.current) fileRef.current.value = ''
    setTimeout(() => setSubmitted(false), 5000)
  }

  const payInfo = PAYMENT_METHODS[form.paymentMethod]
  const pm = settings.payment

  return (
    <section id="order" className="relative py-24 lg:py-32 px-6">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-dark-border to-transparent" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-muted-rose">
            Get in Touch
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-heading font-light">
            Place Your <span className="font-semibold text-muted-rose">Order</span>
          </h2>
          <p className="mt-4 max-w-lg mx-auto text-soft-grey text-sm sm:text-base">
            Fill out the form below and we will confirm your order within 24 hours.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <form
            onSubmit={handleSubmit}
            className="space-y-6 p-8 sm:p-10 rounded-2xl bg-soft-grey-bg/60 border border-dark-border backdrop-blur-sm"
          >
            {/* ─── Customer Info ─── */}
            <div>
              <h3 className="text-sm font-medium text-cream-white mb-4">Customer Info</h3>
              <div className="space-y-4">
                <input
                  name="name" required
                  value={form.name} onChange={handleChange}
                  placeholder="Full Name *"
                  className="w-full px-4 py-3 bg-deep-charcoal border border-dark-border rounded-xl text-cream-white text-sm placeholder-soft-grey/50 focus:outline-none focus:border-muted-rose/50 focus:ring-1 focus:ring-muted-rose/20 transition-all"
                />
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    name="email" type="email" required
                    value={form.email} onChange={handleChange}
                    placeholder="Email *"
                    className="w-full px-4 py-3 bg-deep-charcoal border border-dark-border rounded-xl text-cream-white text-sm placeholder-soft-grey/50 focus:outline-none focus:border-muted-rose/50 focus:ring-1 focus:ring-muted-rose/20 transition-all"
                  />
                  <input
                    name="phone" type="tel" required
                    value={form.phone} onChange={handleChange}
                    placeholder="Phone *"
                    className="w-full px-4 py-3 bg-deep-charcoal border border-dark-border rounded-xl text-cream-white text-sm placeholder-soft-grey/50 focus:outline-none focus:border-muted-rose/50 focus:ring-1 focus:ring-muted-rose/20 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* ─── Address + Governorate ─── */}
            <div>
              <h3 className="text-sm font-medium text-cream-white mb-4">Shipping Address</h3>
              <div className="space-y-4">
                <textarea
                  name="address" required
                  value={form.address} onChange={handleChange}
                  placeholder="Full Address (street, building, apartment) *"
                  rows={2}
                  className="w-full px-4 py-3 bg-deep-charcoal border border-dark-border rounded-xl text-cream-white text-sm placeholder-soft-grey/50 focus:outline-none focus:border-muted-rose/50 focus:ring-1 focus:ring-muted-rose/20 transition-all resize-none"
                />
                <select
                  name="governorate" required
                  value={form.governorate} onChange={handleChange}
                  className="w-full px-4 py-3 bg-deep-charcoal border border-dark-border rounded-xl text-cream-white text-sm focus:outline-none focus:border-muted-rose/50 focus:ring-1 focus:ring-muted-rose/20 transition-all appearance-none"
                >
                  <option value="">Select Governorate *</option>
                  {GOVERNORATES.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>

                {/* ─── Shipping Estimate ─── */}
                {form.governorate && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl bg-deep-charcoal border border-dark-border"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-soft-grey">Shipping to <span className="text-cream-white">{form.governorate}</span></span>
                      <span className="text-muted-rose font-medium">
                        {shipping === 0 ? 'Free' : `EGP ${shipping}`}
                      </span>
                    </div>
                    <p className="text-[10px] text-soft-grey/50 mt-1">
                      {form.governorate === 'Alexandria'
                        ? 'Delivery within 1–2 business days'
                        : 'Delivery within 2–4 business days'}
                    </p>
                  </motion.div>
                )}
              </div>
            </div>

            {/* ─── Product & Quantity ─── */}
            <div>
              <h3 className="text-sm font-medium text-cream-white mb-4">Order Details</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <select
                  name="product" required
                  value={form.product} onChange={handleChange}
                  className="w-full px-4 py-3 bg-deep-charcoal border border-dark-border rounded-xl text-cream-white text-sm focus:outline-none focus:border-muted-rose/50 focus:ring-1 focus:ring-muted-rose/20 transition-all appearance-none"
                >
                  <option value="">Select product *</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.name}>{p.name} — {p.price}</option>
                  ))}
                </select>
                <input
                  name="quantity" type="number" min={1}
                  value={form.quantity} onChange={handleChange}
                  className="w-full px-4 py-3 bg-deep-charcoal border border-dark-border rounded-xl text-cream-white text-sm focus:outline-none focus:border-muted-rose/50 focus:ring-1 focus:ring-muted-rose/20 transition-all"
                />
              </div>
            </div>

            {/* ─── Payment Method ─── */}
            <div>
              <h3 className="text-sm font-medium text-cream-white mb-3">Payment Method *</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(PAYMENT_METHODS).map(([key, pmInfo]) => (
                  <label
                    key={key}
                    className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl border cursor-pointer transition-all text-sm ${
                      form.paymentMethod === key
                        ? 'border-muted-rose bg-muted-rose/10 text-muted-rose'
                        : 'border-dark-border bg-deep-charcoal text-soft-grey hover:border-muted-rose/30'
                    }`}
                  >
                    <input
                      type="radio" name="paymentMethod" value={key}
                      checked={form.paymentMethod === key}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    {pmInfo.label}
                  </label>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {payInfo && (
                  <motion.p
                    key={form.paymentMethod}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="mt-2 text-xs text-soft-grey"
                  >
                    {payInfo.tip}{' '}
                    {payInfo.details && (
                      <span className="text-muted-rose/80 font-medium">
                        {keyDisplay(form.paymentMethod, pm)}
                      </span>
                    )}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* ─── Receipt Upload ─── */}
            {payInfo?.hasReceipt && (
              <div>
                <label className="block text-sm font-medium text-cream-white mb-1.5">
                  Payment Receipt
                </label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFile}
                  className="w-full text-sm text-soft-grey file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-muted-rose/10 file:text-muted-rose file:cursor-pointer hover:file:bg-muted-rose/20 transition-all cursor-pointer"
                />
                {receipt && (
                  <p className="mt-1 text-xs text-muted-rose/80">&#10003; {receipt.name}</p>
                )}
              </div>
            )}

            {/* ─── Notes ─── */}
            <div>
              <textarea
                name="notes" rows={2}
                value={form.notes} onChange={handleChange}
                placeholder="Additional notes..."
                className="w-full px-4 py-3 bg-deep-charcoal border border-dark-border rounded-xl text-cream-white text-sm placeholder-soft-grey/50 focus:outline-none focus:border-muted-rose/50 focus:ring-1 focus:ring-muted-rose/20 transition-all resize-none"
              />
            </div>

            {/* ─── Submit ─── */}
            <button
              type="submit"
              className="w-full py-3.5 bg-muted-rose text-deep-charcoal font-medium text-sm tracking-wider uppercase rounded-xl hover:bg-muted-rose/90 transition-all shadow-lg shadow-muted-rose/20 active:scale-[0.98]"
            >
              Submit Order
            </button>

            <AnimatePresence>
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 rounded-xl bg-muted-rose/10 border border-muted-rose/20 text-center"
                >
                  <p className="text-sm text-muted-rose font-medium">
                    &#10003; Thank you! We have received your order and will contact you shortly.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </div>
    </section>
  )
}

function keyDisplay(key, pm) {
  if (key === 'vodafone') return pm?.vodafoneNumber || ''
  if (key === 'instapay') return pm?.instapayUser || ''
  if (key === 'bank') return pm?.bankDetails || ''
  return ''
}
