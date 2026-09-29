// coords: [lon, lat] of a representative trade hub per region, for the route map
// (Riyadh, Khartoum, Dhaka, Kuala Lumpur, Rotterdam, New York). mapLabel: "below" moves a crowded label under its marker.
export const regions = [
  {
    name: 'GCC',
    coords: [46.7, 24.7],
    countries: 'UAE, Saudi Arabia, Oman, Qatar, Kuwait, Bahrain',
  },
  {
    name: 'East & North Africa',
    coords: [32.5, 15.5],
    mapLabel: 'below',
    countries: 'Kenya, Tanzania, Somalia, Egypt, Sudan',
  },
  {
    name: 'South Asia',
    coords: [90.4, 23.8],
    mapLabel: 'below',
    countries: 'Sri Lanka, Bangladesh, Nepal, Maldives',
  },
  {
    name: 'Southeast Asia',
    coords: [101.7, 3.1],
    countries: 'Indonesia, Malaysia, Vietnam, Thailand',
  },
  {
    name: 'Europe',
    coords: [4.5, 51.9],
    countries: 'United Kingdom, Germany, Netherlands, France',
  },
  {
    name: 'USA & Canada',
    coords: [-74, 40.7],
    countries: 'United States, Canada',
  },
]

export const process = [
  {
    step: '01',
    title: 'Sourcing From Mills',
    blurb: 'We identify and vet rice mills against your grade, aging and volume requirements.',
  },
  {
    step: '02',
    title: 'Quality & Moisture Check',
    blurb: 'Every lot is checked against agreed grade, moisture and purity standards before dispatch.',
  },
  {
    step: '03',
    title: 'Packaging & Documentation',
    blurb: 'Export-grade bagging paired with certificates of origin, invoices and customs paperwork.',
  },
  {
    step: '04',
    title: 'Shipping & Logistics',
    blurb: 'Sea and air freight coordinated through Dubai to your port or inland destination.',
  },
  {
    step: '05',
    title: 'Delivery & Support',
    blurb: 'Tracking, clearance support and after-sales follow-up through to final delivery.',
  },
]
