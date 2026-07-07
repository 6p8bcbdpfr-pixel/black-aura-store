import { useEffect } from 'react'
import { fetchProducts, fetchSiteContent } from '../lib/db'
import { useSiteData } from '../context/SiteDataContext'
import { defaultProducts } from '../data/products'
import { defaultContent } from '../data/siteContent'

export default function SupabaseSync() {
  const { refreshProducts, refreshContent } = useSiteData()

  useEffect(() => {
    const sync = async () => {
      try {
        const products = await fetchProducts()
        if (products && products.length > 0) {
          refreshProducts(products)
        }
      } catch {
        const stored = localStorage.getItem('ba_products')
        if (stored) {
          try { refreshProducts(JSON.parse(stored)) } catch {}
        }
      }
      try {
        const content = await fetchSiteContent()
        if (content) {
          refreshContent(content)
        }
      } catch {
        const stored = localStorage.getItem('ba_siteContent')
        if (stored) {
          try { refreshContent(JSON.parse(stored)) } catch {}
        }
      }
    }
    sync()
  }, [refreshProducts, refreshContent])

  return null
}
