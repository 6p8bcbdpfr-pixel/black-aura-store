import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import AnnouncementBar from './components/AnnouncementBar'
import Hero from './components/Hero'
import FeaturedCollection from './components/FeaturedCollection'
import About from './components/About'
import Testimonials from './components/Testimonials'
import TrustBadges from './components/TrustBadges'
import FAQ from './components/FAQ'
import ContactOrder from './components/ContactOrder'
import CollectionPage from './components/CollectionPage'
import ProductDetail from './components/ProductDetail'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import SupabaseSync from './components/SupabaseSync'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import BackToTop from './components/BackToTop'
import NotFound from './components/NotFound'

function HomePage() {
  return (
    <>
      <AnnouncementBar />
      <Hero />
      <FeaturedCollection />
      <About />
      <Testimonials />
      <TrustBadges />
      <FAQ />
      <ContactOrder />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-deep-charcoal text-cream-white overflow-x-hidden">
          <SupabaseSync />
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/collection" element={<CollectionPage />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <WhatsAppButton />
          <BackToTop />
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}
