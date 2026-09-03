// Central place for real business details pulled from the client's
// Dubai Economy & Tourism trade license / FTA VAT registration certificate.
// Update the placeholder fields (marked below) once the client confirms them.

// Live on Vercel. Update this if a custom domain (e.g. maheshricetrading.com) is
// connected later — also update public/robots.txt and public/sitemap.xml to match.
export const siteUrl = 'https://mahesh-appaso-foodstuff.vercel.app'

export const company = {
  legalNameEn: 'Mahesh Appaso Foodstuff Trading L.L.C',
  legalNameAr: 'ماهيش اباسو لتجارة المواد الغذائية ش.ذ.م.م',
  brandShort: 'Mahesh Rice Trading',
  tagline: 'Basmati & Non-Basmati Rice, Exported From Dubai',

  address: {
    line1: 'SMARK 2, Office 3',
    line2: 'Ras Al Khor Industrial 2',
    city: 'Dubai',
    country: 'United Arab Emirates',
  },

  // Kept for the WhatsApp deep-link only — not displayed as text anywhere on the site.
  phoneHref: '+971528186624',
  whatsapp: '971528186624',
  // Placeholder — client email wasn't on the certificate, confirm before launch.
  email: 'info@maheshricetrading.com',

  hours: 'Sun – Fri, 9:00 AM – 6:00 PM',

  license: {
    number: '1632113',
    authority: 'Dubai Economy and Tourism',
  },
  trn: '105507496500003',

  // Placeholders — swap in the client's real handles before launch.
  social: {
    instagram: 'https://instagram.com/maheshricetrading',
    linkedin: 'https://linkedin.com/company/mahesh-rice-trading',
    facebook: 'https://facebook.com/maheshricetrading',
  },

  mapEmbedSrc:
    'https://maps.google.com/maps?q=Ras%20Al%20Khor%20Industrial%202%2C%20Dubai%2C%20UAE&t=&z=13&ie=UTF8&iom=1&output=embed',
}

export const whatsappLink = (message) =>
  `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(message)}`

export const mailtoLink = (subject, body) =>
  `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
