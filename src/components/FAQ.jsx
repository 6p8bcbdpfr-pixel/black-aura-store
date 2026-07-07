import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const faqs = [
  {
    q: 'How do I place an order?',
    a: 'Browse our collection, select your desired item, choose the size, and click "Order Now". Fill in your details and choose a payment method. We will confirm your order within 24 hours.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept Vodafone Cash, InstaPay, Bank Transfer, and Cash on Delivery. For bank transfers and mobile wallet payments, please upload the receipt after making the payment.',
  },
  {
    q: 'How long does shipping take?',
    a: 'Delivery within Alexandria takes 1–2 business days. Delivery to other governorates takes 2–4 business days. Free shipping is available on orders over EGP 1,000.',
  },
  {
    q: 'Can I return or exchange an item?',
    a: 'Yes, we offer a 14-day return policy. Items must be unused and in their original packaging. Contact us to initiate a return.',
  },
  {
    q: 'How can I contact customer support?',
    a: 'You can reach us via WhatsApp, email at hello@blackaura.com, or call us at +20 100 123 4567. We are available Saturday–Thursday, 10 AM – 8 PM.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <section className="py-24 px-6 border-t border-dark-border">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-muted-rose">
            FAQ
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-heading font-light">
            Frequently Asked <span className="font-semibold text-muted-rose">Questions</span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-dark-border overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium text-cream-white hover:bg-soft-grey-bg/30 transition-colors"
              >
                {faq.q}
                <svg className={`w-4 h-4 text-soft-grey transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="px-5 pb-4 text-sm text-soft-grey leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}