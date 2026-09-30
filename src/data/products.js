// Product catalogue — mirrors the commodity records on https://mafllc.vercel.app
// (entry numbers, names, origin, processing and specs copied as published there).
// Fields left empty there (specs / packaging / markets) show as "On enquiry".
// shortName is ours — a compact label for tight spots like the home hero headline.

export const productCategories = [
  {
    slug: 'rice',
    name: 'Rice',
    title: 'Rice — The Grain Record',
    blurb: 'Basmati and non-basmati rice from India — steam, sella, parboiled and raw sortexed grades, with broken grades on request.',
    image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?q=80&w=1200&auto=format&fit=crop',
    groups: [
      { key: 'basmati', label: 'Basmati' },
      { key: 'non-basmati', label: 'Non-Basmati' },
      { key: 'broken', label: 'Broken Rice' },
    ],
  },
  {
    slug: 'pulses',
    name: 'Pulses',
    title: 'Pulses — The Legume Record',
    blurb: 'Whole and split pulses from India — beans, peas, chickpeas, dal and whole pulses.',
    image: 'https://images.unsplash.com/photo-1515543904379-3d757afe72e4?q=80&w=1200&auto=format&fit=crop',
    groups: [
      { key: 'chickpeas', label: 'Chickpeas' },
      { key: 'lentils', label: 'Lentils' },
      { key: 'beans', label: 'Beans' },
      { key: 'peas', label: 'Peas' },
      { key: 'dal', label: 'Dal' },
      { key: 'whole', label: 'Whole Pulses' },
    ],
  },
]

export const products = [
  // Flagship grades first — this order drives every listing on the site (manifest,
  // category pages, home ticker, headline rotation, enquiry suggestions).
  { id: 'ir64-silky-sortex-raw', entry: 'ENTRY 014', name: 'Silky Sortex Raw IR64', shortName: 'IR64 Sortex', category: 'rice', subcategory: 'non-basmati', origin: 'India', processing: 'raw, sortexed', specs: ['Broken grades: 5% / 10% / 15% / 25% / 100%'], packaging: [], markets: [], status: 'active', verification: 'SOURCE VERIFIED' },
  { id: 'masuri-silky-sortex-raw', entry: 'ENTRY 015', name: 'Silky Sortex Raw Masuri', shortName: 'Masuri Sortex', category: 'rice', subcategory: 'non-basmati', origin: 'India', processing: 'raw, sortexed', specs: ['Broken grades: 5% / 10% / 15% / 25%'], packaging: [], markets: [], status: 'active', verification: 'SOURCE VERIFIED' },
  { id: 'sona-masuri-steam', entry: 'ENTRY 016', name: 'Steam Sona Masuri', shortName: 'Sona Masuri', category: 'rice', subcategory: 'non-basmati', origin: 'India', processing: 'steam', specs: [], packaging: [], markets: [], status: 'active', verification: 'SOURCE VERIFIED' },
  { id: 'lobia', entry: 'ENTRY 005', name: 'Lobia', shortName: 'Lobia', category: 'pulses', subcategory: 'beans', origin: 'India', processing: 'whole', specs: [], packaging: [], markets: [], status: 'active', verification: 'SOURCE VERIFIED' },
  { id: 'matar', entry: 'ENTRY 006', name: 'Matar', shortName: 'Matar', category: 'pulses', subcategory: 'peas', origin: 'India', processing: 'whole', specs: [], packaging: [], markets: [], status: 'active', verification: 'SOURCE VERIFIED' },
  { id: 'kabuli-chana', entry: 'ENTRY 007', name: 'Kabuli Chana', shortName: 'Kabuli Chana', category: 'pulses', subcategory: 'chickpeas', origin: 'India', processing: 'whole', specs: [], packaging: [], markets: [], status: 'active', verification: 'SOURCE VERIFIED' },
  { id: 'rajma', entry: 'ENTRY 008', name: 'Rajma', shortName: 'Rajma', category: 'pulses', subcategory: 'beans', origin: 'India', processing: 'whole', specs: [], packaging: [], markets: [], status: 'active', verification: 'SOURCE VERIFIED' },
  { id: 'kala-chana', entry: 'ENTRY 009', name: 'Kala Chana', shortName: 'Kala Chana', category: 'pulses', subcategory: 'chickpeas', origin: 'India', processing: 'whole', specs: [], packaging: [], markets: [], status: 'active', verification: 'SOURCE VERIFIED' },
  { id: 'chana-dal', entry: 'ENTRY 010', name: 'Chana Dal', shortName: 'Chana Dal', category: 'pulses', subcategory: 'dal', origin: 'India', processing: 'split', specs: [], packaging: [], markets: [], status: 'active', verification: 'SOURCE VERIFIED' },
  { id: 'moong-sabut', entry: 'ENTRY 011', name: 'Moong Sabut', shortName: 'Moong Sabut', category: 'pulses', subcategory: 'whole', origin: 'India', processing: 'whole', specs: [], packaging: [], markets: [], status: 'active', verification: 'SOURCE VERIFIED' },
  { id: 'moong-dhuli', entry: 'ENTRY 012', name: 'Moong Dhuli', shortName: 'Moong Dhuli', category: 'pulses', subcategory: 'dal', origin: 'India', processing: 'split', specs: [], packaging: [], markets: [], status: 'active', verification: 'SOURCE VERIFIED' },
  { id: 'urad-sabut', entry: 'ENTRY 013', name: 'Urad Sabut', shortName: 'Urad Sabut', category: 'pulses', subcategory: 'whole', origin: 'India', processing: 'whole', specs: [], packaging: [], markets: [], status: 'active', verification: 'SOURCE VERIFIED' },
  { id: 'sarbati-steam', entry: 'ENTRY 017', name: 'Sarbati Steam', shortName: 'Sarbati Steam', category: 'rice', subcategory: 'basmati', origin: 'India', processing: 'steam', specs: ['Grain length 7.00mm+', 'Moisture ≤ 14%'], packaging: ['25kg', '50kg', 'Bulk'], markets: [], status: 'active', verification: 'SOURCE VERIFIED' },
  { id: '1121-steam', entry: 'ENTRY 018', name: '1121 Steam', shortName: '1121 Steam', category: 'rice', subcategory: 'basmati', origin: 'India', processing: 'steam', specs: ['Grain length 8.35mm+', 'Moisture ≤ 14%'], packaging: ['25kg', '50kg', 'Bulk'], markets: [], status: 'active', verification: 'SOURCE VERIFIED' },
  { id: '1509-parboiled', entry: 'ENTRY 019', name: '1509 Parboiled', shortName: '1509 Parboiled', category: 'rice', subcategory: 'basmati', origin: 'India', processing: 'parboiled', specs: ['Grain length 8.35mm+', 'Moisture ≤ 14%'], packaging: ['25kg', '50kg', 'Bulk'], markets: [], status: 'active', verification: 'SOURCE VERIFIED' },
  { id: '1121-golden-sella', entry: 'ENTRY 020', name: '1121 Golden Sella', shortName: '1121 Golden Sella', category: 'rice', subcategory: 'basmati', origin: 'India', processing: 'golden sella, parboiled', specs: ['Grain length 8.35mm+', 'Moisture ≤ 14%'], packaging: ['25kg', '50kg', 'Bulk'], markets: [], status: 'active', verification: 'SOURCE VERIFIED' },
  { id: '1509-steam', entry: 'ENTRY 021', name: '1509 Steam', shortName: '1509 Steam', category: 'rice', subcategory: 'basmati', origin: 'India', processing: 'steam', specs: ['Grain length 8.35mm+', 'Moisture ≤ 14%'], packaging: ['25kg', '50kg', 'Bulk'], markets: [], status: 'active', verification: 'SOURCE VERIFIED' },
  { id: '1401-steam', entry: 'ENTRY 022', name: '1401 Steam', shortName: '1401 Steam', category: 'rice', subcategory: 'basmati', origin: 'India', processing: 'steam', specs: ['Grain length 7.85mm+', 'Moisture ≤ 14%'], packaging: ['25kg', '50kg', 'Bulk'], markets: [], status: 'active', verification: 'SOURCE VERIFIED' },
  { id: 'sambha-sella', entry: 'ENTRY 023', name: 'Sambha Sella', shortName: 'Sambha Sella', category: 'rice', subcategory: 'non-basmati', origin: 'India', processing: 'sella', specs: ['Broken 5% max', 'Moisture ≤ 14%'], packaging: ['25kg', '50kg', 'Bulk'], markets: [], status: 'active', verification: 'SOURCE VERIFIED' },
  { id: 'sambha-steam-broken', entry: 'ENTRY 024', name: 'Sambha Steam Broken', shortName: 'Sambha Broken', category: 'rice', subcategory: 'broken', origin: 'India', processing: 'steam', specs: ['Broken 25% max', 'Moisture ≤ 14%'], packaging: ['25kg', '50kg', 'Bulk'], markets: [], status: 'active', verification: 'SOURCE VERIFIED' },
  { id: '100-raw-broken', entry: 'ENTRY 025', name: '100% Raw Broken', shortName: 'Raw Broken', category: 'rice', subcategory: 'broken', origin: 'India', processing: 'raw', specs: ['Broken 100%', 'Moisture ≤ 14%'], packaging: ['25kg', '50kg', 'Bulk'], markets: [], status: 'active', verification: 'SOURCE VERIFIED' },
  { id: 'swarna-masoorie', entry: 'ENTRY 026', name: 'Swarna Masoorie', shortName: 'Swarna Masoorie', category: 'rice', subcategory: 'non-basmati', origin: 'India', processing: 'raw, steam', specs: ['Broken 5% max', 'Moisture ≤ 14%'], packaging: ['25kg', '50kg', 'Bulk'], markets: [], status: 'active', verification: 'SOURCE VERIFIED' },
  { id: 'ir64-silky-sortexed', entry: 'ENTRY 027', name: 'IR64 Silky Sortexed', shortName: 'IR64 Sortexed', category: 'rice', subcategory: 'non-basmati', origin: 'India', processing: 'silky sortexed', specs: ['Broken 5% max', 'Moisture ≤ 14%'], packaging: ['25kg', '50kg', 'Bulk'], markets: [], status: 'active', verification: 'SOURCE VERIFIED' },
  { id: 'pr11-steam', entry: 'ENTRY 028', name: 'PR11 Steam', shortName: 'PR11 Steam', category: 'rice', subcategory: 'non-basmati', origin: 'India', processing: 'steam', specs: ['Broken 5% max', 'Moisture ≤ 14%'], packaging: ['25kg', '50kg', 'Bulk'], markets: [], status: 'active', verification: 'SOURCE VERIFIED' },
  { id: 'pr11-sella', entry: 'ENTRY 029', name: 'PR11 Sella', shortName: 'PR11 Sella', category: 'rice', subcategory: 'non-basmati', origin: 'India', processing: 'sella', specs: ['Broken 5% max', 'Moisture ≤ 14%'], packaging: ['25kg', '50kg', 'Bulk'], markets: [], status: 'active', verification: 'SOURCE VERIFIED' },
]

export const ON_ENQUIRY = 'On enquiry'

export const getCategory = (slug) => productCategories.find((c) => c.slug === slug)

export const getProductsByCategory = (slug) =>
  products.filter((p) => p.category === slug && p.status === 'active')

export const getProduct = (category, id) =>
  products.find((p) => p.category === category && p.id === id)

/** Active products of a category, bucketed by subcategory in the category's group order. */
export const getGroupedProducts = (slug) => {
  const category = getCategory(slug)
  if (!category) return []
  return category.groups
    .map((g) => ({ ...g, items: getProductsByCategory(slug).filter((p) => p.subcategory === g.key) }))
    .filter((g) => g.items.length > 0)
}

export const subcategoryLabel = (categorySlug, key) =>
  getCategory(categorySlug)?.groups.find((g) => g.key === key)?.label ?? key
