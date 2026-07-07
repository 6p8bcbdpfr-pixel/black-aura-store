/* ─── Egyptian Governorates ─── */
export const GOVERNORATES = [
  'Alexandria',
  'Aswan',
  'Asyut',
  'Beheira',
  'Beni Suef',
  'Cairo',
  'Dakahlia',
  'Damietta',
  'Faiyum',
  'Gharbia',
  'Giza',
  'Ismailia',
  'Kafr El Sheikh',
  'Luxor',
  'Matrouh',
  'Minya',
  'Monufia',
  'New Valley',
  'North Sinai',
  'Port Said',
  'Qalyubia',
  'Qena',
  'Red Sea',
  'Sharqia',
  'Sohag',
  'South Sinai',
  'Suez',
]

/* ─── Payment Methods ─── */
export const PAYMENT_METHODS = {
  vodafone: {
    label: 'Vodafone Cash',
    details: '0100 123 4567',
    tip: 'Send to the number above, then upload the receipt.',
    hasReceipt: true,
  },
  instapay: {
    label: 'InstaPay',
    details: '@BlackAuraShop',
    tip: 'Send via InstaPay to the username above, then upload the receipt.',
    hasReceipt: true,
  },
  bank: {
    label: 'Bank Transfer',
    details: 'CIB — 1000123456',
    tip: 'Transfer to the account above, then upload the receipt.',
    hasReceipt: true,
  },
  cod: {
    label: 'Cash on Delivery',
    details: '',
    tip: 'Pay in cash when you receive your order.',
    hasReceipt: false,
  },
}

/* ─── Shipping calculation ─── */
export function calcShipping(governorate, settings) {
  const gov = (governorate || '').trim().toLowerCase()
  const isAlex = gov === 'alexandria' || gov === 'اسكندرية'
  const ship = settings?.shipping
  return isAlex
    ? Number(ship?.alexandria) || 0
    : Number(ship?.outside) || 0
}
