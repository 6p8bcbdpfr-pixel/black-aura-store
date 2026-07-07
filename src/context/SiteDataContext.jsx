import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { defaultProducts } from '../data/products'
import { defaultContent, deepMerge } from '../data/siteContent'

const PROD_KEY = 'ba_products'
const CONTENT_KEY = 'ba_siteContent'

const SiteDataContext = createContext(null)

function loadInitialProducts() {
  try {
    const stored = localStorage.getItem(PROD_KEY)
    if (stored) return JSON.parse(stored)
  } catch {}
  return [...defaultProducts]
}

function loadInitialContent() {
  try {
    const stored = localStorage.getItem(CONTENT_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return deepMerge(defaultContent, parsed)
    }
  } catch {}
  return deepMerge(defaultContent, {})
}

export function SiteDataProvider({ children }) {
  const [products, setProducts] = useState(loadInitialProducts)
  const [siteContent, setSiteContent] = useState(loadInitialContent)
  const [loading, setLoading] = useState(true)
  const mounted = useRef(true)

  useEffect(() => {
    return () => { mounted.current = false }
  }, [])

  const refreshProducts = useCallback((newProducts) => {
    if (!mounted.current) return
    setProducts(newProducts)
    try { localStorage.setItem(PROD_KEY, JSON.stringify(newProducts)) } catch {}
  }, [])

  const refreshContent = useCallback((newContent) => {
    if (!mounted.current) return
    const merged = deepMerge(defaultContent, newContent)
    setSiteContent(merged)
    try { localStorage.setItem(CONTENT_KEY, JSON.stringify(newContent)) } catch {}
  }, [])

  useEffect(() => {
    setLoading(false)
  }, [])

  return (
    <SiteDataContext.Provider value={{ products, siteContent, loading, refreshProducts, refreshContent }}>
      {children}
    </SiteDataContext.Provider>
  )
}

export function useSiteData() {
  const ctx = useContext(SiteDataContext)
  if (!ctx) throw new Error('useSiteData must be used within SiteDataProvider')
  return ctx
}
