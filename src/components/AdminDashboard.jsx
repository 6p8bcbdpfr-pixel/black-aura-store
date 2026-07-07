import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import {
  getProducts,
  saveProducts,
} from '../data/products'
import {
  getSiteContent,
  saveSiteContent,
  resetSiteContent,
  compressImage,
} from '../data/siteContent'
import {
  fetchProducts as fetchProductsFromDB,
  saveProduct as saveProductToDB,
  deleteProduct as deleteProductFromDB,
  fetchOrders as fetchOrdersFromDB,
  deleteAllOrders as deleteAllOrdersFromDB,
  saveSiteContentToSupabase,
} from '../lib/db'
import { isUploadedImage } from './ProductImage'

/* ─── Tabs ─── */
const TABS = ['Products', 'Site Content', 'Orders']

/* ─── Slugify helper ─── */
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/* ─── Empty product template ─── */
const emptyProduct = {
  id: Date.now(),
  slug: '',
  name: '',
  category: '',
  price: '',
  description: '',
  sizes: ['One Size'],
  images: ['from-zinc-800 to-zinc-900', 'from-zinc-800 to-zinc-900', 'from-zinc-800 to-zinc-900'],
  details: [''],
}

export default function AdminDashboard() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('Products')

  return (
    <section className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* ─── Header ─── */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-light text-cream-white">
              Admin <span className="font-semibold text-muted-rose">Dashboard</span>
            </h1>
            <p className="text-xs text-soft-grey mt-1">Manage your site content</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="text-xs text-soft-grey hover:text-muted-rose transition-colors"
            >
              View Site &rarr;
            </a>
            <button
              onClick={() => {
                logout()
                navigate('/admin/login')
              }}
              className="px-4 py-2 text-xs font-medium text-soft-grey border border-dark-border rounded-xl hover:border-red-500/30 hover:text-red-400 transition-all"
            >
              Logout
            </button>
          </div>
        </div>

        {/* ─── Tabs ─── */}
        <div className="flex gap-1 mb-8 p-1 rounded-xl bg-soft-grey-bg/60 border border-dark-border w-fit">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                tab === t
                  ? 'bg-muted-rose/15 text-muted-rose'
                  : 'text-soft-grey hover:text-cream-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ─── Tab Content ─── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {tab === 'Products' && <ProductsTab />}
            {tab === 'Site Content' && <SiteContentTab />}
            {tab === 'Orders' && <OrdersTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════
   PRODUCTS TAB
   ════════════════════════════════════════════ */
function ProductsTab() {
  const [products, setProducts] = useState([])
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const fromDB = await fetchProductsFromDB()
      saveProducts(fromDB)
      setProducts(fromDB)
    } catch {
      const local = getProducts()
      setProducts(local)
    }
    setLoading(false)
  }

  const refresh = () => setProducts(getProducts())

  const handleDelete = async (slug) => {
    try {
      await deleteProductFromDB(slug)
    } catch {}
    const updated = products.filter((p) => p.slug !== slug)
    saveProducts(updated)
    refresh()
    if (editing?.slug === slug) setEditing(null)
  }

  const handleSave = async (product) => {
    try {
      await saveProductToDB(product)
    } catch {}
    const idx = products.findIndex((p) => p.slug === product.slug)
    let updated
    if (idx >= 0) {
      updated = products.map((p) => (p.slug === product.slug ? product : p))
    } else {
      updated = [...products, product]
    }
    saveProducts(updated)
    refresh()
    setEditing(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-6 h-6 border-2 border-muted-rose border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* ─── Product List ─── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-cream-white">
            All Products ({products.length})
          </h2>
          <button
            onClick={() =>
              setEditing({ ...emptyProduct, id: Date.now(), slug: '' })
            }
            className="px-4 py-1.5 text-xs font-medium bg-muted-rose/10 text-muted-rose rounded-xl hover:bg-muted-rose/20 transition-all"
          >
            + Add New
          </button>
        </div>

        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
          {products.map((p) => (
            <div
              key={p.id}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                editing?.id === p.id
                  ? 'border-muted-rose/30 bg-muted-rose/5'
                  : 'border-dark-border bg-soft-grey-bg/30 hover:border-muted-rose/10'
              }`}
              onClick={() => setEditing(p)}
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-cream-white truncate">
                  {p.name || 'Untitled'}
                </p>
                <p className="text-xs text-soft-grey">{p.category} &middot; {p.price}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete(p.slug)
                }}
                className="p-1.5 text-soft-grey hover:text-red-400 transition-colors flex-shrink-0"
                title="Delete"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Edit Form ─── */}
      <div>
        {editing ? (
          <ProductForm
            key={editing.id}
            initial={editing}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
          />
        ) : (
          <div className="p-8 rounded-xl border border-dashed border-dark-border bg-soft-grey-bg/20 text-center">
            <p className="text-sm text-soft-grey">Select a product or add a new one</p>
          </div>
        )}
      </div>
    </div>
  )
}

function ProductForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial)
  const [saving, setSaving] = useState(false)

  const handleChange = (field, value) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value }
      if (field === 'name') {
        updated.slug = slugify(value) || prev.slug
      }
      return updated
    })
  }

  const handleArrayField = (field, index, value) => {
    setForm((prev) => {
      const arr = [...prev[field]]
      arr[index] = value
      return { ...prev, [field]: arr }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.price) return
    setSaving(true)
    const product = { ...form, slug: form.slug || slugify(form.name) }
    onSave(product)
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 rounded-xl border border-dark-border bg-soft-grey-bg/50">
      <h3 className="text-sm font-medium text-cream-white mb-3">Edit Product</h3>

      {/* Name */}
      <div>
        <label className="block text-xs text-soft-grey mb-1">Name *</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full px-3 py-2 bg-deep-charcoal border border-dark-border rounded-lg text-sm text-cream-white focus:outline-none focus:border-muted-rose/50"
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block text-xs text-soft-grey mb-1">Slug (URL)</label>
        <input
          type="text"
          value={form.slug}
          onChange={(e) => handleChange('slug', slugify(e.target.value))}
          className="w-full px-3 py-2 bg-deep-charcoal border border-dark-border rounded-lg text-sm text-cream-white focus:outline-none focus:border-muted-rose/50"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs text-soft-grey mb-1">Category</label>
        <input
          type="text"
          value={form.category}
          onChange={(e) => handleChange('category', e.target.value)}
          className="w-full px-3 py-2 bg-deep-charcoal border border-dark-border rounded-lg text-sm text-cream-white focus:outline-none focus:border-muted-rose/50"
        />
      </div>

      {/* Price */}
      <div>
        <label className="block text-xs text-soft-grey mb-1">Price *</label>
        <input
          type="text"
          value={form.price}
          onChange={(e) => handleChange('price', e.target.value)}
          placeholder="EGP 1,000"
          className="w-full px-3 py-2 bg-deep-charcoal border border-dark-border rounded-lg text-sm text-cream-white focus:outline-none focus:border-muted-rose/50"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs text-soft-grey mb-1">Description</label>
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className="w-full px-3 py-2 bg-deep-charcoal border border-dark-border rounded-lg text-sm text-cream-white focus:outline-none focus:border-muted-rose/50 resize-none"
        />
      </div>

      {/* Sizes */}
      <div>
        <label className="block text-xs text-soft-grey mb-1">Sizes (comma separated)</label>
        <input
          type="text"
          value={form.sizes.join(', ')}
          onChange={(e) =>
            handleChange(
              'sizes',
              e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
            )
          }
          className="w-full px-3 py-2 bg-deep-charcoal border border-dark-border rounded-lg text-sm text-cream-white focus:outline-none focus:border-muted-rose/50"
        />
      </div>

      {/* Images — file upload */}
      <div>
        <label className="block text-xs text-soft-grey mb-2">
          Product Images (upload from computer or type gradient class)
        </label>
        {form.images.map((img, i) => (
          <div key={i} className="flex items-center gap-3 mb-2">
            {/* Preview */}
            <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border border-dark-border bg-deep-charcoal">
              {isUploadedImage(img) ? (
                <img src={img} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${img} flex items-center justify-center`}>
                  <span className="text-[8px] text-soft-grey/40">{i + 1}</span>
                </div>
              )}
            </div>
            {/* Upload button */}
            <ImageUpload
              index={i}
              current={img}
              onUpload={(dataUrl) => handleArrayField('images', i, dataUrl)}
            />
            {/* Fallback: gradient text input */}
            <input
              type="text"
              value={isUploadedImage(img) ? '(uploaded image)' : img}
              onChange={(e) => handleArrayField('images', i, e.target.value)}
              className="flex-1 min-w-0 px-3 py-2 bg-deep-charcoal border border-dark-border rounded-lg text-sm text-cream-white focus:outline-none focus:border-muted-rose/50"
              placeholder={`Image ${i + 1} gradient (e.g. from-zinc-800 to-zinc-900)`}
            />
          </div>
        ))}
      </div>

      {/* Details */}
      <div>
        <label className="block text-xs text-soft-grey mb-1">
          Details (one per line)
        </label>
        <textarea
          rows={4}
          value={form.details.join('\n')}
          onChange={(e) =>
            handleChange(
              'details',
              e.target.value.split('\n').filter(Boolean)
            )
          }
          className="w-full px-3 py-2 bg-deep-charcoal border border-dark-border rounded-lg text-sm text-cream-white focus:outline-none focus:border-muted-rose/50 resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 py-2.5 bg-muted-rose text-deep-charcoal text-sm font-medium rounded-xl hover:bg-muted-rose/90 transition-all disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Product'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 text-sm text-soft-grey border border-dark-border rounded-xl hover:border-muted-rose/30 hover:text-cream-white transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

/* ════════════════════════════════════════════
   SITE CONTENT TAB
   ════════════════════════════════════════════ */
function SiteContentTab() {
  const [content, setContent] = useState(getSiteContent())
  const [saved, setSaved] = useState(false)

  const handleChange = (section, field, value) => {
    setContent((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }))
  }

  const handleValuesChange = (index, field, value) => {
    setContent((prev) => {
      const values = [...prev.values]
      values[index] = { ...values[index], [field]: value }
      return { ...prev, values }
    })
  }

  const handleSave = async () => {
    saveSiteContent(content)
    try {
      await saveSiteContentToSupabase(content)
    } catch {}
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReset = () => {
    if (window.confirm('Reset site content to defaults?')) {
      const defaults = resetSiteContent()
      setContent(defaults)
    }
  }

  return (
    <div className="max-w-2xl space-y-8">
      {/* ─── Hero ─── */}
      <section className="p-6 rounded-xl border border-dark-border bg-soft-grey-bg/50">
        <h3 className="text-sm font-medium text-cream-white mb-4">Hero Section</h3>
        <div className="space-y-3">
          <Field label="Badge" value={content.hero.badge} onChange={(v) => handleChange('hero', 'badge', v)} />
          <Field label="Headline (before accent)" value={content.hero.headline} onChange={(v) => handleChange('hero', 'headline', v)} />
          <Field label="Headline Accent" value={content.hero.headlineAccent} onChange={(v) => handleChange('hero', 'headlineAccent', v)} />
          <TextareaField label="Subheadline" value={content.hero.subheadline} onChange={(v) => handleChange('hero', 'subheadline', v)} />
          <Field label="CTA Primary Text" value={content.hero.ctaText || ''} onChange={(v) => handleChange('hero', 'ctaText', v)} />
          <Field label="CTA Secondary Text" value={content.hero.ctaSecondaryText || ''} onChange={(v) => handleChange('hero', 'ctaSecondaryText', v)} />
        </div>
      </section>

      {/* ─── About ─── */}
      <section className="p-6 rounded-xl border border-dark-border bg-soft-grey-bg/50">
        <h3 className="text-sm font-medium text-cream-white mb-4">About Section</h3>
        <div className="space-y-3">
          <Field label="Badge" value={content.about.badge} onChange={(v) => handleChange('about', 'badge', v)} />
          <Field label="Headline (before accent)" value={content.about.headline} onChange={(v) => handleChange('about', 'headline', v)} />
          <Field label="Headline Accent" value={content.about.headlineAccent} onChange={(v) => handleChange('about', 'headlineAccent', v)} />
          <Field label="Headline End" value={content.about.headlineEnd} onChange={(v) => handleChange('about', 'headlineEnd', v)} />
          <TextareaField label="Paragraph" value={content.about.paragraph} onChange={(v) => handleChange('about', 'paragraph', v)} />
          <Field label="Year text" value={content.about.year} onChange={(v) => handleChange('about', 'year', v)} />
        </div>
      </section>

      {/* ─── Shipping ─── */}
      <section className="p-6 rounded-xl border border-dark-border bg-soft-grey-bg/50">
        <h3 className="text-sm font-medium text-cream-white mb-4">Shipping Settings</h3>
        <div className="space-y-3">
          <Field label="Alexandria delivery fee (EGP)" value={content.shipping?.alexandria || ''} onChange={(v) => handleChange('shipping', 'alexandria', v)} />
          <Field label="Outside Alexandria delivery fee (EGP)" value={content.shipping?.outside || ''} onChange={(v) => handleChange('shipping', 'outside', v)} />
          <Field label="Free shipping threshold (EGP, 0 = disabled)" value={content.shipping?.freeThreshold || '0'} onChange={(v) => handleChange('shipping', 'freeThreshold', v)} />
        </div>
      </section>

      {/* ─── Payment Details ─── */}
      <section className="p-6 rounded-xl border border-dark-border bg-soft-grey-bg/50">
        <h3 className="text-sm font-medium text-cream-white mb-4">Payment Details</h3>
        <div className="space-y-3">
          <Field label="Vodafone Cash number" value={content.payment?.vodafoneNumber || ''} onChange={(v) => handleChange('payment', 'vodafoneNumber', v)} />
          <Field label="InstaPay username" value={content.payment?.instapayUser || ''} onChange={(v) => handleChange('payment', 'instapayUser', v)} />
          <Field label="Bank transfer details" value={content.payment?.bankDetails || ''} onChange={(v) => handleChange('payment', 'bankDetails', v)} />
        </div>
      </section>

      {/* ─── Values ─── */}
      <section className="p-6 rounded-xl border border-dark-border bg-soft-grey-bg/50">
        <h3 className="text-sm font-medium text-cream-white mb-4">Brand Values</h3>
        <div className="space-y-4">
          {content.values.map((v, i) => (
            <div key={i} className="p-4 rounded-lg border border-dark-border bg-deep-charcoal/50">
              <p className="text-xs text-soft-grey mb-2">Value {i + 1}</p>
              <Field label="Title" value={v.title} onChange={(val) => handleValuesChange(i, 'title', val)} />
              <div className="mt-2">
                <TextareaField label="Description" value={v.desc} onChange={(val) => handleValuesChange(i, 'desc', val)} />
              </div>
              <div className="mt-2">
                <Field label="Icon (emoji/symbol)" value={v.icon} onChange={(val) => handleValuesChange(i, 'icon', val)} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Images ─── */}
      <section className="p-6 rounded-xl border border-dark-border bg-soft-grey-bg/50">
        <h3 className="text-sm font-medium text-cream-white mb-4">Site Images</h3>
        <div className="space-y-4">
          <ImageUploadField label="Logo" value={content.images.logo} onChange={(v) => handleChange('images', 'logo', v)} />
          <ImageUploadField label="Hero Background" value={content.images.heroBg} onChange={(v) => handleChange('images', 'heroBg', v)} />
          <ImageUploadField label="About Image" value={content.images.aboutImage} onChange={(v) => handleChange('images', 'aboutImage', v)} />
        </div>
      </section>

      {/* ─── Collection ─── */}
      <section className="p-6 rounded-xl border border-dark-border bg-soft-grey-bg/50">
        <h3 className="text-sm font-medium text-cream-white mb-4">Collection Section</h3>
        <div className="space-y-3">
          <Field label="Badge" value={content.collection?.badge || ''} onChange={(v) => handleChange('collection', 'badge', v)} />
          <Field label="Title (before accent)" value={content.collection?.title || ''} onChange={(v) => handleChange('collection', 'title', v)} />
          <Field label="Title Accent" value={content.collection?.titleAccent || ''} onChange={(v) => handleChange('collection', 'titleAccent', v)} />
          <TextareaField label="Description" value={content.collection?.description || ''} onChange={(v) => handleChange('collection', 'description', v)} />
          <Field label="CTA Text" value={content.collection?.ctaText || ''} onChange={(v) => handleChange('collection', 'ctaText', v)} />
        </div>
      </section>

      {/* ─── Contact ─── */}
      <section className="p-6 rounded-xl border border-dark-border bg-soft-grey-bg/50">
        <h3 className="text-sm font-medium text-cream-white mb-4">Contact Information</h3>
        <div className="space-y-3">
          <Field label="Email" value={content.contact?.email || ''} onChange={(v) => handleChange('contact', 'email', v)} />
          <Field label="Phone" value={content.contact?.phone || ''} onChange={(v) => handleChange('contact', 'phone', v)} />
          <Field label="Working Hours" value={content.contact?.workingHours || ''} onChange={(v) => handleChange('contact', 'workingHours', v)} />
        </div>
      </section>

      {/* ─── Social Links ─── */}
      <section className="p-6 rounded-xl border border-dark-border bg-soft-grey-bg/50">
        <h3 className="text-sm font-medium text-cream-white mb-4">Social Links</h3>
        <div className="space-y-3">
          <Field label="Instagram URL" value={content.social?.instagram || ''} onChange={(v) => handleChange('social', 'instagram', v)} />
          <Field label="Facebook URL" value={content.social?.facebook || ''} onChange={(v) => handleChange('social', 'facebook', v)} />
          <Field label="WhatsApp URL" value={content.social?.whatsapp || ''} onChange={(v) => handleChange('social', 'whatsapp', v)} />
        </div>
      </section>

      {/* ─── Footer ─── */}
      <section className="p-6 rounded-xl border border-dark-border bg-soft-grey-bg/50">
        <h3 className="text-sm font-medium text-cream-white mb-4">Footer</h3>
        <div className="space-y-3">
          <Field label="Tagline" value={content.footer?.tagline || ''} onChange={(v) => handleChange('footer', 'tagline', v)} />
        </div>
      </section>

      {/* ─── Actions ─── */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-muted-rose text-deep-charcoal text-sm font-medium rounded-xl hover:bg-muted-rose/90 transition-all"
        >
          {saved ? 'Saved!' : 'Save Content'}
        </button>
        <button
          onClick={handleReset}
          className="px-5 py-2.5 text-sm text-soft-grey border border-dark-border rounded-xl hover:border-red-500/30 hover:text-red-400 transition-all"
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  )
}

/* ─── Reusable field components ─── */
function Field({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-xs text-soft-grey mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-deep-charcoal border border-dark-border rounded-lg text-sm text-cream-white focus:outline-none focus:border-muted-rose/50"
      />
    </div>
  )
}

function TextareaField({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-xs text-soft-grey mb-1">{label}</label>
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-deep-charcoal border border-dark-border rounded-lg text-sm text-cream-white focus:outline-none focus:border-muted-rose/50 resize-none"
      />
    </div>
  )
}

/* ─── Site Image Upload Field ─── */
function ImageUploadField({ label, value, onChange }) {
  const inputRef = useRef(null)
  const hasImage = value && value.startsWith('data:image')

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const dataUrl = await compressImage(file)
    onChange(dataUrl)
    e.target.value = ''
  }

  return (
    <div>
      <label className="block text-xs text-soft-grey mb-1.5">{label}</label>
      <div className="flex items-center gap-3">
        {/* Preview */}
        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-dark-border bg-deep-charcoal">
          {hasImage ? (
            <img src={value} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-6 h-6 text-soft-grey/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
              </svg>
            </div>
          )}
        </div>
        {/* Upload */}
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" id={`site-img-${label}`} />
        <label htmlFor={`site-img-${label}`}
          className="px-3 py-1.5 text-xs font-medium bg-muted-rose/10 text-muted-rose rounded-lg hover:bg-muted-rose/20 transition-all cursor-pointer whitespace-nowrap"
        >{hasImage ? 'Change' : 'Upload'}</label>
        {hasImage && (
          <button type="button" onClick={() => onChange('')}
            className="px-2 py-1.5 text-xs text-soft-grey hover:text-red-400 transition-colors"
          >Remove</button>
        )}
      </div>
    </div>
  )
}

/* ─── Image Upload + Compression (product images) ─── */
function ImageUpload({ index, current, onUpload }) {
  const inputRef = useRef(null)

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    // Compress to high-quality JPEG, max 1200px
    const reader = new FileReader()
    reader.onload = (ev) => {
      const img = new Image()
      img.onload = () => {
        const MAX = 1200
        let w = img.width
        let h = img.height
        if (w > MAX) {
          h = Math.round((h * MAX) / w)
          w = MAX
        }
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        // Smooth downscaling
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, w, h)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.92)
        onUpload(dataUrl)
      }
      img.src = ev.target.result
    }
    reader.readAsDataURL(file)
    // Reset input so same file can be re-selected
    e.target.value = ''
  }

  return (
    <div className="flex items-center gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
        id={`img-upload-${index}`}
      />
      <label
        htmlFor={`img-upload-${index}`}
        className="px-3 py-1.5 text-xs font-medium bg-muted-rose/10 text-muted-rose rounded-lg hover:bg-muted-rose/20 transition-all cursor-pointer whitespace-nowrap"
      >
        {isUploadedImage(current) ? 'Change' : 'Upload'}
      </label>
      {isUploadedImage(current) && (
        <button
          type="button"
          onClick={() => onUpload('from-zinc-800 to-zinc-900')}
          className="px-2 py-1.5 text-xs text-soft-grey hover:text-red-400 transition-colors"
        >
          Remove
        </button>
      )}
    </div>
  )
}

/* ════════════════════════════════════════════
   ORDERS TAB
   ════════════════════════════════════════════ */
function OrdersTab() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    setLoading(true)
    try {
      const data = await fetchOrdersFromDB()
      setOrders(data)
    } catch {
      try {
        const stored = localStorage.getItem('ba_orders')
        if (stored) setOrders(JSON.parse(stored))
      } catch {}
    }
    setLoading(false)
  }

  const handleClear = async () => {
    if (window.confirm('Delete all orders?')) {
      try {
        await deleteAllOrdersFromDB()
      } catch {}
      localStorage.removeItem('ba_orders')
      setOrders([])
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-6 h-6 border-2 border-muted-rose border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="p-8 rounded-xl border border-dashed border-dark-border bg-soft-grey-bg/20 text-center">
        <p className="text-sm text-soft-grey">No orders yet</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-cream-white">
          Orders ({orders.length})
        </h2>
        <button
          onClick={handleClear}
          className="px-4 py-1.5 text-xs font-medium text-soft-grey border border-dark-border rounded-xl hover:border-red-500/30 hover:text-red-400 transition-all"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-3">
        {orders.map((order, i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-dark-border bg-soft-grey-bg/50"
          >
            <div className="flex items-start justify-between mb-2">
              <p className="text-sm font-medium text-cream-white">{order.name}</p>
              <span className="text-[10px] text-soft-grey">{order.date || ''}</span>
            </div>
            <div className="space-y-1 text-xs text-soft-grey">
              <p>Email: {order.email}</p>
              <p>Phone: {order.phone}</p>
              <p>Product: {order.product} x{order.quantity}</p>
              <p>Payment: {order.paymentMethod}</p>
              {order.notes && <p>Notes: {order.notes}</p>}
              {order.receipt && <p className="text-muted-rose/70">Receipt: {order.receipt}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
