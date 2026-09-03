import { company } from '../data/company'

const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
)

const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M4 9h3v11H4zM5.5 3A1.75 1.75 0 1 1 5.5 6.5 1.75 1.75 0 0 1 5.5 3ZM11 9h2.8v1.6h.04c.4-.75 1.35-1.6 2.78-1.6 2.97 0 3.38 1.95 3.38 4.5V20h-3v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.15 1.46-2.15 2.96V20h-3z" />
  </svg>
)

const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M15 8h2V4h-2a4 4 0 0 0-4 4v2H9v4h2v8h4v-8h2.5L18 10h-3V8a1 1 0 0 1 1-1Z" strokeLinejoin="round" />
  </svg>
)

const platforms = [
  { Icon: InstagramIcon, href: company.social.instagram, label: 'Instagram' },
  { Icon: LinkedinIcon, href: company.social.linkedin, label: 'LinkedIn' },
  { Icon: FacebookIcon, href: company.social.facebook, label: 'Facebook' },
]

export default function SocialLinks({ className = '', iconClassName = 'w-4 h-4' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {platforms.map(({ Icon, href, label }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
          className="w-9 h-9 rounded-full border border-current/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors"
        >
          <Icon className={iconClassName} />
        </a>
      ))}
    </div>
  )
}
