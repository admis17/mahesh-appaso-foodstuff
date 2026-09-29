// Product catalogue — mirrors the commodity records on https://mafllc.vercel.app
// (entry numbers, names, origin, processing and specs copied as published there).
// Fields left empty there (specs / packaging / markets) show as "On enquiry".
// shortName is ours — a compact label for tight spots like the home hero headline.

export const productCategories = [
  {
    slug: 'rice',
    name: 'Rice',
    title: 'Rice — The Grain Record',
    blurb: 'Non-basmati rice from India — raw sortexed and steam grades, with broken grades on request.',
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
  { id: 'lobia', entry: 'ENTRY 005', name: 'Lobia', shortName: 'Lobia', category: 'pulses', subcategory: 'beans', origin: 'India', processing: 'whole', specs: [], packaging: [], markets: [], status: 'active', verification: 'SOURCE VERIFIED' },
  { id: 'matar', entry: 'ENTRY 006', name: 'Matar', shortName: 'Matar', category: 'pulses', subcategory: 'peas', origin: 'India', processing: 'whole', specs: [], packaging: [], markets: [], status: 'active', verification: 'SOURCE VERIFIED' },
  { id: 'kabuli-chana', entry: 'ENTRY 007', name: 'Kabuli Chana', shortName: 'Kabuli Chana', category: 'pulses', subcategory: 'chickpeas', origin: 'India', processing: 'whole', specs: [], packaging: [], markets: [], status: 'active', verification: 'SOURCE VERIFIED' },
  { id: 'rajma', entry: 'ENTRY 008', name: 'Rajma', shortName: 'Rajma', category: 'pulses', subcategory: 'beans', origin: 'India', processing: 'whole', specs: [], packaging: [], markets: [], status: 'active', verification: 'SOURCE VERIFIED' },
  { id: 'kala-chana', entry: 'ENTRY 009', name: 'Kala Chana', shortName: 'Kala Chana', category: 'pulses', subcategory: 'chickpeas', origin: 'India', processing: 'whole', specs: [], packaging: [], markets: [], status: 'active', verification: 'SOURCE VERIFIED' },
  { id: 'chana-dal', entry: 'ENTRY 010', name: 'Chana Dal', shortName: 'Chana Dal', category: 'pulses', subcategory: 'dal', origin: 'India', processing: 'split', specs: [], packaging: [], markets: [], status: 'active', verification: 'SOURCE VERIFIED' },
  { id: 'moong-sabut', entry: 'ENTRY 011', name: 'Moong Sabut', shortName: 'Moong Sabut', category: 'pulses', subcategory: 'whole', origin: 'India', processing: 'whole', specs: [], packaging: [], markets: [], status: 'active', verification: 'SOURCE VERIFIED' },
  { id: 'moong-dhuli', entry: 'ENTRY 012', name: 'Moong Dhuli', shortName: 'Moong Dhuli', category: 'pulses', subcategory: 'dal', origin: 'India', processing: 'split', specs: [], packaging: [], markets: [], status: 'active', verification: 'SOURCE VERIFIED' },
  { id: 'urad-sabut', entry: 'ENTRY 013', name: 'Urad Sabut', shortName: 'Urad Sabut', category: 'pulses', subcategory: 'whole', origin: 'India', processing: 'whole', specs: [], packaging: [], markets: [], status: 'active', verification: 'SOURCE VERIFIED' },
  { id: 'ir64-silky-sortex-raw', entry: 'ENTRY 014', name: 'Silky Sortex Raw IR64', shortName: 'IR64 Sortex', category: 'rice', subcategory: 'non-basmati', origin: 'India', processing: 'raw, sortexed', specs: ['Broken grades: 5% / 10% / 15% / 25% / 100%'], packaging: [], markets: [], status: 'active', verification: 'SOURCE VERIFIED' },
  { id: 'masuri-silky-sortex-raw', entry: 'ENTRY 015', name: 'Silky Sortex Raw Masuri', shortName: 'Masuri Sortex', category: 'rice', subcategory: 'non-basmati', origin: 'India', processing: 'raw, sortexed', specs: ['Broken grades: 5% / 10% / 15% / 25%'], packaging: [], markets: [], status: 'active', verification: 'SOURCE VERIFIED' },
  { id: 'sona-masuri-steam', entry: 'ENTRY 016', name: 'Steam Sona Masuri', shortName: 'Sona Masuri', category: 'rice', subcategory: 'non-basmati', origin: 'India', processing: 'steam', specs: [], packaging: [], markets: [], status: 'active', verification: 'SOURCE VERIFIED' },
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
