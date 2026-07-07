import { useEffect } from 'react'
import { fetchProducts, fetchSiteContent } from '../lib/db'
import { saveProducts } from '../data/products'
import { saveSiteContent } from '../data/siteContent'

export default function SupabaseSync() {
  useEffect(() => {
    const sync = async () => {
      try {
        const products = await fetchProducts()
        if (products && products.length > 0) {
          saveProducts(products)
        }
      } catch {}
      try {
        const content = await fetchSiteContent()
        if (content) {
          saveSiteContent(content)
        }
      } catch {}
    }
    sync()
  }, [])

  return null
}