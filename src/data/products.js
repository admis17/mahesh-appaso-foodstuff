// Two top-level categories, each with its own detailed variety range.
// Variety names/grades follow standard rice-trade terminology (industry-wide,
// not brand-specific) — update quantities/specs once the client confirms them.

export const riceCategories = [
  {
    slug: 'basmati-rice',
    name: 'Basmati Rice',
    blurb: 'Premium aromatic long-grain rice sourced for international markets.',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=1200&auto=format&fit=crop',
  },
  {
    slug: 'non-basmati-rice',
    name: 'Non-Basmati Rice',
    blurb: 'A broad range of non-basmati grades for wholesale and bulk markets.',
    image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?q=80&w=1200&auto=format&fit=crop',
  },
]

export const basmatiVarieties = [
  {
    slug: '1121-steam',
    name: '1121 Steam',
    tag: 'Steam',
    blurb: 'Extra-long slender grain with a strong aromatic profile, steam-processed for consistent cooking performance across foodservice and retail packs.',
    specs: { processing: 'Steam', moisture: '≤ 14%', grainLength: '8.35mm+', packaging: '25kg / 50kg / Bulk' },
  },
  {
    slug: '1121-golden-sella',
    name: '1121 Golden Sella',
    tag: 'Golden Sella',
    blurb: 'Parboiled long-grain basmati with a distinctive golden colour and firm texture, a steady favourite with wholesale buyers across the GCC.',
    specs: { processing: 'Golden Sella / Parboiled', moisture: '≤ 14%', grainLength: '8.35mm+', packaging: '25kg / 50kg / Bulk' },
  },
  {
    slug: '1509-steam',
    name: '1509 Steam',
    tag: 'Steam',
    blurb: 'Long, aromatic grains with reliable separation after cooking — a dependable mid-tier basmati for bulk and retail supply.',
    specs: { processing: 'Steam', moisture: '≤ 14%', grainLength: '8.20mm+', packaging: '25kg / 50kg / Bulk' },
  },
  {
    slug: 'traditional-steam',
    name: 'Traditional Steam',
    tag: 'Steam',
    blurb: 'Aged traditional basmati valued for its deep aroma and elongation on cooking, favoured by buyers who ask for it by name.',
    specs: { processing: 'Steam', moisture: '≤ 14%', grainLength: '7.00mm+', packaging: '25kg / 50kg / Bulk' },
  },
  {
    slug: 'basmati-broken',
    name: 'Basmati Broken',
    tag: 'Broken',
    blurb: 'Economical broken-grain basmati for industrial and food-service buyers where whole-grain length is not required.',
    specs: { processing: 'Steam / Raw', moisture: '≤ 14%', grainLength: 'Broken', packaging: '25kg / 50kg / Bulk' },
  },
]

export const nonBasmatiVarieties = [
  {
    slug: 'ir64-raw-sortex',
    name: 'IR64 Raw Sortex',
    tag: 'Raw / Sortex',
    blurb: 'A versatile, widely traded non-basmati variety with consistent grain quality — sortex-cleaned for reliable bulk export.',
    specs: { processing: 'Raw / Sortex', grades: '5% / 10% / 25% / 100% Broken', quality: 'Sortex Sorted', packaging: '25kg / 50kg / Bulk' },
  },
  {
    slug: 'sona-masuri-steam',
    name: 'Sona Masuri Steam',
    tag: 'Steam',
    blurb: 'A light-textured, everyday steam rice popular across South Asian and East African retail markets.',
    specs: { processing: 'Steam', moisture: '≤ 14%', quality: 'Export Grade', packaging: '25kg / 50kg / Bulk' },
  },
  {
    slug: 'swarna-steam',
    name: 'Swarna Steam',
    tag: 'Steam',
    blurb: 'A dependable bulk steam variety selected for consistent cooking performance and steady supply.',
    specs: { processing: 'Steam', moisture: '≤ 14%', broken: '5% Max', packaging: '25kg / 50kg / Bulk' },
  },
  {
    slug: 'pr11-sella',
    name: 'PR11 Sella',
    tag: 'Sella',
    blurb: 'Parboiled non-basmati rice processed for firm texture and dependable performance in bulk catering use.',
    specs: { processing: 'Sella', moisture: '≤ 14%', broken: '5% Max', packaging: '25kg / 50kg / Bulk' },
  },
  {
    slug: '100-raw-broken',
    name: '100% Raw Broken',
    tag: 'Broken',
    blurb: 'Fully broken raw rice for commercial and industrial applications where price and consistent supply matter most.',
    specs: { processing: 'Raw', moisture: '≤ 14%', broken: '100% Broken', packaging: '25kg / 50kg / Bulk' },
  },
]
