import { getSupabase } from './supabase'
import { defaultProducts } from '../data/products'
import { defaultContent } from '../data/siteContent'

/* ─── Products ─── */

export async function fetchProducts() {
  const supabase = getSupabase()
  const { data, error } = await supabase.from('products').select('*').order('id')
  if (error) throw error
  if (data && data.length > 0) {
    return data.map(normalizeProduct)
  }
  return defaultProducts
}

export async function saveProduct(product) {
  const supabase = getSupabase()
  const { id, ...rest } = product
  const record = {
    slug: rest.slug,
    name: rest.name,
    category: rest.category || '',
    price: rest.price || '',
    description: rest.description || '',
    sizes: JSON.stringify(rest.sizes || []),
    images: JSON.stringify(rest.images || []),
    details: JSON.stringify(rest.details || []),
  }

  if (id && id > 0) {
    const { error } = await supabase.from('products').update(record).eq('id', id)
    if (error) throw error
  } else {
    const { error } = await supabase.from('products').insert(record)
    if (error) throw error
  }
}

export async function deleteProduct(slug) {
  const supabase = getSupabase()
  const { error } = await supabase.from('products').delete().eq('slug', slug)
  if (error) throw error
}

function normalizeProduct(p) {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category || '',
    price: p.price || '',
    description: p.description || '',
    sizes: typeof p.sizes === 'string' ? JSON.parse(p.sizes) : p.sizes || [],
    images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images || [],
    details: typeof p.details === 'string' ? JSON.parse(p.details) : p.details || [],
  }
}

/* ─── Orders ─── */

export async function submitOrder(order) {
  const supabase = getSupabase()
  const { error } = await supabase.from('orders').insert({
    name: order.name,
    email: order.email || '',
    phone: order.phone || '',
    address: order.address || '',
    governorate: order.governorate || '',
    product: order.product || '',
    quantity: order.quantity || 1,
    payment_method: order.paymentMethod || '',
    notes: order.notes || '',
    size: order.size || '',
    shipping: order.shipping || 0,
    receipt: order.receipt || '',
    date: order.date || new Date().toLocaleString('en-EG'),
  })
  if (error) throw error
}

export async function fetchOrders() {
  const supabase = getSupabase()
  const { data, error } = await supabase.from('orders').select('*').order('id', { ascending: false })
  if (error) throw error
  return data || []
}

export async function deleteAllOrders() {
  const supabase = getSupabase()
  const { error } = await supabase.from('orders').delete().neq('id', 0)
  if (error) throw error
}

/* ─── Site Content ─── */

export async function fetchSiteContent() {
  const supabase = getSupabase()
  const { data, error } = await supabase.from('site_content').select('data').eq('id', 1).single()
  if (error) {
    if (error.code === 'PGRST116') return defaultContent
    throw error
  }
  if (data?.data && Object.keys(data.data).length > 0) {
    return deepMerge(defaultContent, data.data)
  }
  return defaultContent
}

export async function saveSiteContentToSupabase(content) {
  const supabase = getSupabase()
  const { error } = await supabase.from('site_content').upsert({ id: 1, data: content })
  if (error) throw error
}

/* ─── Helpers ─── */

function deepMerge(base, override) {
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
