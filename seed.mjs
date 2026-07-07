import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://nfozfjgupiercugvittk.supabase.co',
  process.env.SUPABASE_SERVICE_KEY || 'your-service-key-here'
);

const products = [
  { slug: 'obsidian-tote', name: 'Obsidian Tote', category: 'Handbags', price: 'EGP 2,450', description: 'A spacious everyday tote crafted from premium vegan leather.', sizes: JSON.stringify(['One Size']), images: JSON.stringify(['from-zinc-800 to-zinc-900', 'from-zinc-700 to-zinc-800', 'from-zinc-800 to-zinc-900']), details: JSON.stringify(['Vegan leather exterior', 'Magnetic snap closure', 'Interior zip pocket', 'Gold-toned hardware', 'Dimensions: 38 x 30 x 12 cm']) },
  { slug: 'noir-chain-bracelet', name: 'Noir Chain Bracelet', category: 'Jewelry', price: 'EGP 890', description: 'A delicate chain bracelet with an adjustable clasp.', sizes: JSON.stringify(['S (16cm)', 'M (18cm)', 'L (20cm)']), images: JSON.stringify(['from-zinc-700 to-zinc-800', 'from-zinc-800 to-zinc-900', 'from-zinc-700 to-zinc-800']), details: JSON.stringify(['Hypoallergenic stainless steel', 'Adjustable clasp', 'Tarnish-resistant finish', 'Weight: 4.2g']) },
  { slug: 'aura-sunglasses', name: 'Aura Sunglasses', category: 'Eyewear', price: 'EGP 1,290', description: 'Oversized cat-eye frames with UV400 protection.', sizes: JSON.stringify(['One Size']), images: JSON.stringify(['from-zinc-800 to-zinc-900', 'from-zinc-700 to-zinc-800', 'from-zinc-800 to-zinc-900']), details: JSON.stringify(['UV400 protection', 'Lightweight acetate frame', 'Crystal-clear lenses', 'Includes hard case & microfiber cloth']) },
  { slug: 'silk-scarf-dusty-rose', name: 'Silk Scarf \u2014 Dusty Rose', category: 'Scarves', price: 'EGP 1,150', description: 'A luxurious mulberry silk scarf in our signature dusty rose hue.', sizes: JSON.stringify(['90 x 90 cm']), images: JSON.stringify(['from-muted-rose/20 to-dusty-lavender/10', 'from-muted-rose/20 to-zinc-800', 'from-dusty-lavender/20 to-zinc-800']), details: JSON.stringify(['100% mulberry silk', 'Hand-rolled edges', 'Digital print', 'Dry clean only']) },
  { slug: 'minimalist-watch', name: 'Minimalist Watch', category: 'Watches', price: 'EGP 3,200', description: 'A slim-profile timepiece with a sunburst dial and Italian leather strap.', sizes: JSON.stringify(['S (14cm)', 'M (16cm)', 'L (18cm)']), images: JSON.stringify(['from-zinc-700 to-zinc-800', 'from-zinc-800 to-zinc-900', 'from-zinc-700 to-zinc-800']), details: JSON.stringify(['Quartz movement', 'Italian leather strap', 'Mineral crystal glass', 'Water resistant (3 ATM)', 'Japanese mechanism']) },
  { slug: 'leather-cardholder', name: 'Leather Cardholder', category: 'Accessories', price: 'EGP 680', description: 'Slim RFID-blocking cardholder crafted from full-grain leather.', sizes: JSON.stringify(['One Size']), images: JSON.stringify(['from-zinc-800 to-zinc-900', 'from-zinc-700 to-zinc-800', 'from-zinc-800 to-zinc-900']), details: JSON.stringify(['Full-grain leather', 'RFID blocking', 'Holds 6 cards', 'Slim profile: 1 cm thick', 'Embossed logo']) },
];

const { error } = await supabase.from('products').upsert(products, { onConflict: 'slug' });
if (error) {
  console.error('Error:', error.message);
} else {
  console.log('Done! 6 products seeded to Supabase.');
}
